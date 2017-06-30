import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('HtmlFieldView');

export default class HtmlFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        editorId: PropTypes.string,
        editorConfig: PropTypes.object,
        inputProps: PropTypes.object,
        onEdit: PropTypes.func,
    };

    componentDidMount() {

        const editor = window.CKEDITOR.replace(this.props.editorId, this.props.editorConfig);
        editor.on('change', () => {
            editor.updateElement();
            this.props.inputProps.onChange(this.refs.input.value);
            return false;
        });
    }

    render() {
        return (
            <FieldWrapper
                {...this.props}
                className={bem(
                    bem.block(),
                    this.props.className,
                )}
            >
                <textarea
                    ref='input'
                    {...this.props.inputProps}
                    className={bem(bem.element('input'), 'form-control')}
                />
            </FieldWrapper>
        );
    }

}
