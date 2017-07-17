import React from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

import {html} from 'components';

const bem = html.bem('FileItem');

export default class FileItem extends React.Component {

    static propTypes = {
        uid: PropTypes.string,
        fileId: PropTypes.number,
        title: PropTypes.string,
        error: PropTypes.string,
        image: PropTypes.shape({
            src: PropTypes.string,
            width: PropTypes.number,
            height: PropTypes.number,
            alt: PropTypes.string,
        }),
        progress: PropTypes.shape({
            uploaded: PropTypes.string,
            percent: PropTypes.number,
        }),
        bytesUploadedText: PropTypes.string,
        onRemove: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className={bem.block()}>
                {this.props.image && (
                    <img
                        {...this.props.image}
                        className={bem.element('image')}
                    />
                )}
                {this.props.fileId && (
                    <a
                        href='javascript:void(0)'
                        className={bem.element('remove')}
                        onClick={this.props.onRemove}
                    >
                        ×
                    </a>
                )}
                <div className={bem.element('status')}>
                    {this._renderStatus()}
                </div>
            </div>
        );
    }

    _renderStatus() {
        if (this.props.error) {
            return (
                <OverlayTrigger
                    placement='bottom'
                    overlay={(
                        <Tooltip id={`tooltip-error-${this.props.fileId}`}>
                            {this.props.error}
                        </Tooltip>
                    )}
                >
                    <div className={bem.element('status-error')}>
                        Ошибка
                    </div>
                </OverlayTrigger>
            );
        }

        if (this.props.progress) {
            return (
                <OverlayTrigger
                    placement='bottom'
                    overlay={(
                        <Tooltip id={`tooltip-progress-${this.props.fileId}`}>
                            <span>
                                {this.props.progress.uploaded}
                                &nbsp;
                                из
                            </span>
                        </Tooltip>
                    )}
                >
                    <div className={bem(bem.element('status-progress'), 'progress')}>
                        <div
                            className={bem(bem.element('progress-bar'), 'progress-bar')}
                            style={{
                                width: this.props.progress.percent + '%'
                            }}
                        >
                            {this.props.progress.percent}
                            %
                        </div>
                    </div>
                </OverlayTrigger>
            );
        }

        return (
            <div className={bem.element('status-name')}>
                {this.props.title}
            </div>
        );
    }

}
