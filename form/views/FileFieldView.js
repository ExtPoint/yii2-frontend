import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FileItem from './FileItem';
import FieldWrapper from './FieldWrapper';
import Button from '../Button';

const bem = html.bem('FileFieldView');

export default class FileFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        buttonProps: PropTypes.object,
        buttonLabel: PropTypes.string,
        multiple: PropTypes.bool,
        items: PropTypes.arrayOf(PropTypes.shape({
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
            onRemove: PropTypes.func.isRequired,
        })),
    };

    render() {
        return (
            <FieldWrapper
                {...this.props}
                className={bem(
                    bem.block(),
                    this.props.className,
                )}
            >
                <div className={bem.element('files-container')}>
                    {this.props.items.map(item => (
                        <FileItem
                            key={item.uid}
                            {...item}
                        />
                    ))}
                </div>
                <div className={bem.element('button-container')}>
                    <Button
                        size='sm'
                        color='default'
                        {...this.props.buttonProps}
                    >
                        <span className='glyphicon glyphicon-file' />
                        &nbsp;
                        {this.props.buttonLabel}
                    </Button>
                </div>
            </FieldWrapper>
        );
    }

}
