import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getFormValues} from 'redux-form';
import fileup from 'fileup-redux';
import File from 'fileup-core/lib/models/File';
import FilePropType from 'fileup-redux/lib/types/FilePropType';

import {fetchByIds, clearCache} from '../actions/formList';
import {getEntries} from '../reducers/formList';

import {types} from 'components';

class FileField extends React.Component {

    static propTypes = {
        fieldId: PropTypes.string,
        modelClass: PropTypes.string,
        attribute: PropTypes.string,
        metaItem: PropTypes.object.isRequired,
        multiple: PropTypes.bool,
        disabled: PropTypes.bool,
        buttonLabel: PropTypes.any,
        buttonProps: PropTypes.object,
        remove: PropTypes.func,
        files: PropTypes.arrayOf(FilePropType),
        thumbnailProcessor: PropTypes.string,
    };

    static defaultProps = {
        thumbnailProcessor: 'default',
    };

    static asHumanFileSize(bytes, showZero) {
        if (!bytes) {
            return showZero ? '0' : '';
        }

        const thresh = 1000;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' ' + 'B';
        }
        const units = [
            'kB',
            'MB',
            'GB',
            'TB',
            'PB',
            'EB',
            'ZB',
            'YB'
        ];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    }

    constructor(props) {
        super(props);

        this._onBrowseClick = this._onBrowseClick.bind(this);
    }

    componentWillMount() {
        this._syncValue(this.props);
    }

    componentDidMount() {
        // Async load files data from backend
        const values = [].concat(this.props.input.value || []);
        if (this.props.files.length < values.length) {
            this.props.dispatch(fetchByIds(this.props.fieldId, values, {
                method: '', // TODO
                model: this.props.modelClass,
                attribute: this.props.attribute,
                processor: this.props.thumbnailProcessor,
            }));
        }
    }

    componentWillReceiveProps(nextProps) {
        this._syncValue(nextProps);

        if (this.props.initialFiles.length === 0 && nextProps.initialFiles.length > 0) {
            this.props.add(nextProps.initialFiles.map(file => {
                delete file.id;
                return file;
            }));
            this.props.dispatch(clearCache(this.props.fieldId, [].concat(this.props.input.value || [])));
        }
    }

    render() {
        const {buttonLabel, buttonProps, disabled, files, remove, thumbnailProcessor, uploader, ...props} = this.props; // eslint-disable-line no-unused-vars
        const FileFieldView = types.getViewComponent('FileFieldView');
        return (
            <FileFieldView
                {...props}
                buttonProps={{
                    size: 'sm',
                    ...buttonProps,
                    disabled,
                    onClick: this._onBrowseClick,
                }}
                buttonLabel={buttonLabel || (this.props.multiple ? 'Прикрепить файлы' : 'Прикрепить файл')}
                items={files.map(file => {
                    const data = file.resultHttpMessage || {};
                    return {
                        uid: file.uid,
                        fileId: data.id || null,
                        title: file.name,
                        error: file.result === File.RESULT_ERROR
                            ? file.resultHttpMessage.error
                            : null,
                        image: data.images && data.images[this.props.thumbnailProcessor]
                            ? {
                                src: data.images[this.props.thumbnailProcessor].url,
                                width: data.images[this.props.thumbnailProcessor].width,
                                height: data.images[this.props.thumbnailProcessor].height,
                                alt: file.name,
                            }
                            : null,
                        progress: file.status === File.STATUS_PROCESS
                            ? {
                                uploaded: FileField.asHumanFileSize(file.bytesUploaded),
                                percent: file.progress.percent,
                            }
                            : null,
                        onRemove: () => this._onUserRemove(file.uid),
                    };
                })}
            />
        );
    }

    _onBrowseClick(e) {
        e.preventDefault();
        this.props.uploader.browse();
    }

    _onUserRemove(uid) {
        const file = this.props.files.find(file => file.uid === uid);
        const id = file.resultHttpMessage && file.resultHttpMessage.id || null;
        if (id) {
            if (this.props.multiple) {
                this.props.input.onChange([].concat(this.props.input.value || []).filter(i => i !== id));
            } else if (parseInt(this.props.input.value) === parseInt(id)) {
                this.props.input.onChange(null);
            }
        } else {
            this.props.remove(uid);
        }
    }

    _syncValue(props) {
        const prevInputIds = [].concat(this.props.input.value || []);
        let inputIds = [].concat(props.input.value || []);
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
        let hasChanges = false;
        uploaderIds.forEach(id => {
            if (inputIds.indexOf(id) === -1) {
                if (this.props.multiple) {
                    inputIds.push(id);
                } else {
                    inputIds = [id];
                }
                hasChanges = true;
            }
        });
        if (this.props.input && hasChanges) {
            this.props.input.onChange(inputIds);
        }
    }

}

const FileFieldHoc = fileup()(FileField);

class FileFieldWrapper extends React.Component {

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

        this._id = 'FileField_' + FileFieldWrapper.ID_COUNTER++;
    }

    render() {
        let reduxStateId = [
            'file',
            this.props.id,
            this.props.formId,
            this.props.formValues.id,
            this.props.input && this.props.input.name,
        ]
            .filter(Boolean).join('_');
        if (!reduxStateId) {
            reduxStateId = this._id;
        }

        return (
            <FileFieldHoc
                reduxStateId={reduxStateId}
                backendUrl={'/file/upload/' + (this.props.thumbnailProcessor ? '?processor=' + this.props.thumbnailProcessor : '')}
                {...this.props}
            />
        );
    }
}

export default connect(
    (state, props) => ({
        formValues: getFormValues(props.formId)(state) || {},
        initialFiles: getEntries(state, props.fieldId, [].concat(props.input.value || [])) || {},
    })
)(FileFieldWrapper);