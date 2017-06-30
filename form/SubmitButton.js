import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';

import Button from './Button';

const ButtonHoc = connect(
    (state, props) => ({
        form: props.formId,
    })
)(reduxForm({})(Button));

export default class SubmitButton extends React.Component {

    static contextTypes = {
        formId: PropTypes.string.isRequired,
    };

    render() {
        return (
            <ButtonHoc
                {...this.props}
                type='submit'
                formId={this.context.formId}
            />
        );
    }
}