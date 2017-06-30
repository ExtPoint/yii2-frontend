import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';
import StringField from '../StringField';
import DropDownField from '../DropDownField';

const bem = html.bem('CategorizedStringFieldView');

export default class CategorizedStringFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        stringProps: PropTypes.object,
        dropDownProps: PropTypes.object,
        left: PropTypes.bool,
    };

    render() {
        return (
            <FieldWrapper
                {...this.props}
                className={bem(
                    bem.block(),
                    bem.block({left: this.props.left}),
                    this.props.className,
                    'input-group',
                )}
            >
                {this.renderContent()}
            </FieldWrapper>
        );
    }

    renderContent() {
        let content = [
            <StringField
                key='string'
                {...this.props.stringProps}
            />,
            <div className='input-group-btn'>
                <DropDownField
                    key='dropDown'
                    {...this.props.dropDownProps}
                />
            </div>
        ];
        if (this.props.left) {
            content = content.reverse();
        }
        return content;
    }

}
