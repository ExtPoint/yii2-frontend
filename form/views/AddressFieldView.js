import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';
import StringField from '../StringField';
import DropDownField from '../DropDownField';

const bem = html.bem('AddressFieldView');

export default class AddressFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        stringProps: PropTypes.object,
        dropDownProps: PropTypes.object,
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
                {this.props.stringProps && (
                    <StringField {...this.props.stringProps}/>
                )}
                {this.props.dropDownProps && (
                    <DropDownField {...this.props.dropDownProps}/>
                )}
            </FieldWrapper>
        );
    }

}
