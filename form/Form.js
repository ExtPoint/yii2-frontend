import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {reduxForm, SubmissionError} from 'redux-form';

import {http, form} from 'components';

class Form extends React.Component {

    static propTypes = {
        formId: PropTypes.string.isRequired,
        modelMeta: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        action: PropTypes.string,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
        onSubmit: PropTypes.func,
        onComplete: PropTypes.func,
        contentId: PropTypes.string,
    };

    static childContextTypes = {
        modelMeta: PropTypes.oneOfType([
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
            modelMeta: this.props.modelMeta,
            formId: this.props.formId,
            layout: this.props.layout,
            layoutCols: this.props.layoutCols,
        };
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

    render() {
        const {handleSubmit, modelMeta, formId, children, action, onSubmit, onComplete, ...props} = this.props; // eslint-disable-line no-unused-vars
        const FormView = form.getViewComponent('FormView');
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

    _onSubmit(values) {
        if (this.props.onSubmit) {
            return this.props.onSubmit(values);
        }

        return http.post(this.props.action || location.pathname, values)
            .then(response => {
                if (response.errors) {
                    throw new SubmissionError(response.errors);
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
    })
)(reduxForm({})(Form));