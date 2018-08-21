import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import fileup from 'fileup-redux';
import FilePropType from 'fileup-redux/lib/types/FilePropType';
import File from 'fileup-core/lib/models/File';
import QueueCollection from 'fileup-core/lib/models/QueueCollection';
import _sum from 'lodash/sum';

import {view, locale} from 'components';

class FileButtonField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        multiple: PropTypes.bool,
        color: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
        size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
        backendUrl: PropTypes.string,
        files: PropTypes.arrayOf(FilePropType),
        uploader: PropTypes.shape({
            browse: PropTypes.func,
            remove: PropTypes.func,
        }),
        onUpload: PropTypes.func,
        folder: PropTypes.string,
        cleanOnUpload: PropTypes.bool,
        thumbnailProcessor: PropTypes.string,
    };

    static defaultProps = {
        size: 'md',
        color: 'primary',
    };

    constructor(props) {
        super(props);

        this._onAllEnd = this._onAllEnd.bind(this);
        this._syncValue(props);
    }

    componentDidMount() {
        this.props.uploader.queue.on(QueueCollection.EVENT_ALL_END, this._onAllEnd);
    }

    componentWillUnMount() {
        this.props.uploader.queue.off(QueueCollection.EVENT_ALL_END, this._onAllEnd);
    }

    componentWillReceiveProps(nextProps) {
        this._syncValue(nextProps);
    }

    render() {
        const percent = this.getProgressPercent();
        let buttonLabel = this.props.multiple ? locale.t('Загрузить файлы') : locale.t('Загрузить файл');
        if (percent === 100) {
            buttonLabel = locale.t('Загружено');
        } else if (percent > 0) {
            buttonLabel = locale.t('Загрузка {percent}%...', {percent});
        }

        const {size, color, ...props} = this.props;
        const FileButtonFieldView = this.props.view || view.getFormView('FileButtonFieldView');
        return (
            <FileButtonFieldView
                {...props}
                labelProps={null}
                buttonProps={{
                    size,
                    color,
                    disabled: percent > 0,
                    onClick: () => this.props.uploader.browse(),
                }}
                buttonLabel={buttonLabel}
                percent={percent}
            />
        );
    }

    getProgressPercent() {
        const percents = this.props.files.map(file => {
            if (file.status === File.STATUS_END) {
                return 100;
            }
            if (file.status === File.STATUS_PROCESS) {
                return file.progress && file.progress.percent || 0;
            }
            return 0;
        });
        return Math.round(_sum(percents) / percents.length);
    }

    _syncValue(props) {
        const prevInputIds = [].concat((this.props.input ? this.props.input.value : this.props.value) || []);
        const inputIds = [].concat((props.input ? props.input.value : props.value) || []);
        const uploaderIds = props.files
            .map(file => file.resultHttpMessage && file.resultHttpMessage.id || null)
            .filter(Boolean);

        // Remove files on value change (by form, for example - reset)
        if (prevInputIds.join() !== inputIds.join()) {
            const removeIds = prevInputIds.filter(id => inputIds.indexOf(id) === -1);
            const removeUids = props.files
                .filter(file => file.resultHttpMessage && removeIds.indexOf(file.resultHttpMessage.id) !== -1)
                .map(file => file.uid);
            this.props.remove(removeUids);
        }

        // Add new ids from files
        if (inputIds.join() !== uploaderIds.join()) {
            if (this.props.input) {
                this.props.input.onChange(uploaderIds);
            }
        }
    }

    _onAllEnd() {
        const uploaderIds = this.props.files
            .map(file => file.resultHttpMessage && file.resultHttpMessage.id || null)
            .filter(Boolean);
        if (this.props.onUpload) {
            this.props.onUpload(uploaderIds);
        }
        if (this.props.cleanOnUpload) {
            if (this.props.input) {
                this.props.input.onChange([]);
            } else {
                this.props.remove(this.props.files.map(file => file.uid));
            }
        }
    }

}

const FileButtonFieldHoc = fileup()(FileButtonField);

class FileButtonFieldWrapper extends React.Component {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
    };

    static contextTypes = {
        prefix: PropTypes.string,
    };

    static ID_COUNTER = 0;

    constructor() {
        super(...arguments);

        this._id = 'FileButtonField_' + FileButtonFieldWrapper.ID_COUNTER++;
    }

    render() {
        let reduxStateId = [
            'file',
            this.props.id,
            this.props.formId,
            this.props.formValues && this.props.formValues.id,
            this.props.input && this.props.input.name,
        ]
            .filter(Boolean).join('_');
        if (!reduxStateId) {
            reduxStateId = this._id;
        }

        const params = {
            processor: this.props.thumbnailProcessor,
            folder: this.props.folder,
        };
        const query = Object.keys(params)
            .filter(key => !!params[key])
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');

        return (
            <FileButtonFieldHoc
                reduxStateId={reduxStateId}
                backendUrl={'/file/upload/' + (query ? '?' + query : '')}
                {...this.props}
            />
        );
    }
}

export default connect(
    (state, props) => ({
        formValues: getFormValues(props.formId)(state) || {},
    })
)(FileButtonFieldWrapper);