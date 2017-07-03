import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {types} from 'components';

export default class RangeField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        component: PropTypes.func,
        attributesMap: PropTypes.object,
        fromProps: PropTypes.object,
        toProps: PropTypes.object,
    };

    constructor() {
        super(...arguments);

        this.renderField = this.renderField.bind(this);
    }

    render() {
        const {fromProps, toProps, attributesMap, labelProps, errorProps, hintProps, ...props} = this.props;
        const RangeFieldView = types.getViewComponent('RangeFieldView');
        return (
            <RangeFieldView
                {...props}
                labelProps={labelProps}
                errorProps={errorProps}
                hintProps={hintProps}
                fromProps={{
                    attribute: this.props.attribute,
                    input: _get(this.props, attributesMap[this.props.attribute]).input,
                    ...props,
                    ...fromProps,
                }}
                toProps={{
                    attribute: this.props.metaItem.refAttribute,
                    input: _get(this.props, attributesMap[this.props.metaItem.refAttribute]).input,
                    ...props,
                    ...toProps,
                }}
                renderField={this.renderField}
            />
        );
    }

    renderField(props) {
        // Get input field config
        const fieldConfig = types.getFieldConfig(this.props.metaItem.subAppType);

        // Get input component
        const FieldCompoent = this.props.component || types.getFieldComponent(fieldConfig.component || 'StringField');
        delete fieldConfig.component;

        return (
            <FieldCompoent
                {...props}
                {...fieldConfig}
                layout='inline'
            />
        );
    }

}
