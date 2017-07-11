import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {reduxForm, SubmissionError, getFormValues, initialize} from 'redux-form';
import _isEqual from 'lodash/isEqual';

import {http, types, clientStorage} from 'components';

class Form extends React.Component {

    static STORAGE_KEY_PREFIX = 'Form';

    static propTypes = {
        formId: PropTypes.string.isRequired,
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        action: PropTypes.string,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
        onSubmit: PropTypes.func,
        onChange: PropTypes.func,
        onComplete: PropTypes.func,
        contentId: PropTypes.string,
        formValues: PropTypes.object,
        autoSave: PropTypes.bool,
    };

    static childContextTypes = {
        model: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        formId: PropTypes.string,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
    };

    constructor() {
        super(...arguments);

        this._previousNodeParent = null;
        this._onSubmit = this._onSubmit.bind(this);
    }

    getChildContext() {
        return {
            model: this.props.model,
            formId: this.props.formId,
            layout: this.props.layout,
            layoutCols: this.props.layoutCols,
        };
    }

    componentWillMount() {
        if (this.props.autoSave) {
            const values = clientStorage.get(`${Form.STORAGE_KEY_PREFIX}_${this.props.formId}`);
            if (values) {
                this.props.dispatch(initialize(this.props.formId, JSON.parse(values)));
            }

        }
    }

    componentDidMount() {
        if (this.props.contentId) {
            const node = document.getElementById(this.props.contentId);
            this._previousNodeParent = node.parentNode;
            this.refs.content.appendChild(node);
        }
    }

    componentWillUnmount() {
        if (this.props.contentId) {
            this.refs.content.appendChild(this._previousNodeParent);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_isEqual(this.props.formValues, nextProps.formValues)) {
            this._onChange(nextProps.formValues);
        }
    }

    render() {
        const {handleSubmit, model, formId, children, action, onSubmit, onComplete, ...props} = this.props; // eslint-disable-line no-unused-vars
        const FormView = types.getViewComponent('FormView');
        return (
            <FormView
                {...props}
                onSubmit={this.props.handleSubmit(this._onSubmit)}
            >
                {children}
                <span ref='content' />
            </FormView>
        );
    }

    _onChange(values) {
        if (this.props.onChange) {
            this.props.onChange(values);
        }

        if (this.props.autoSave) {
            clientStorage.set(`${Form.STORAGE_KEY_PREFIX}_${this.props.formId}`, JSON.stringify(values));
        }
    }

    _onSubmit(values) {
        if (this.props.onSubmit) {
            return this.props.onSubmit(values);
        }

        return http.post(this.props.action || location.pathname, values)
            .then(response => {
                if (response.errors) {
                    throw new SubmissionError(response.errors);
                }

                if (this.props.autoSave) {
                    clientStorage.remove(`${Form.STORAGE_KEY_PREFIX}_${this.props.formId}`);
                }

                if (this.props.onComplete) {
                    this.props.onComplete(values, response);
                }
            });
    }

}

export default connect(
    (state, props) => ({
        form: props.formId,
        formValues: getFormValues(props.formId)(state),
    })
)(reduxForm({})(Form));