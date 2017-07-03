import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import {types} from 'components';

export default class CategorizedStringField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        attributesMap: PropTypes.object,
        left: PropTypes.bool,
        stringProps: PropTypes.object,
        dropDownProps: PropTypes.object,
    };

    static defaultProps = {
        stringProps: {},
        dropDownProps: {},
    };

    render() {
        const {fieldId, metaItem, stringProps, dropDownProps, ...props} = this.props;
        const CategorizedStringFieldView = types.getViewComponent('CategorizedStringFieldView');
        return (
            <CategorizedStringFieldView
                {...props}
                stringProps={{
                    input: _get(this.props, this.props.attributesMap[this.props.attribute]).input,
                    metaItem,
                    ...stringProps,
                }}
                dropDownProps={{
                    input: _get(this.props, this.props.attributesMap[metaItem.refAttribute]).input,
                    fieldId,
                    metaItem,
                    ...dropDownProps,
                }}
            />
        );
    }

}
