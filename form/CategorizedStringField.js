import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {view} from 'components';

export default class CategorizedStringField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        attributesMap: PropTypes.object,
        left: PropTypes.bool,
        disabled: PropTypes.bool,
        stringProps: PropTypes.object,
        dropDownProps: PropTypes.object,
    };

    static defaultProps = {
        stringProps: {},
        dropDownProps: {},
    };

    render() {
        const {fieldId, formId, metaItem, disabled, stringProps, dropDownProps, ...props} = this.props;
        const CategorizedStringFieldView = this.props.view || view.getFormView('CategorizedStringFieldView');
        return (
            <CategorizedStringFieldView
                {...props}
                stringProps={{
                    input: _get(this.props, this.props.attributesMap[this.props.attribute]).input,
                    formId,
                    metaItem,
                    disabled,
                    ...stringProps,
                }}
                dropDownProps={{
                    input: _get(this.props, this.props.attributesMap[metaItem.refAttribute]).input,
                    formId,
                    fieldId,
                    metaItem,
                    disabled,
                    ...dropDownProps,
                }}
            />
        );
    }

}
