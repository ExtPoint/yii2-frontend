import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import _get from 'lodash/get';

import {toggleItem, toggleAll} from 'actions/list';
import {isCheckedAll} from '../reducers/list';
import CheckboxField from '../form/CheckboxField';

@connect(
    (state, props) => {
        const itemId = props.item[_get(state, `list.${props.listId}.primaryKey`)];
        return {
            itemId,
            isChecked: !!_get(state, `list.${props.listId}.checkedIds.${itemId}`),
            isCheckedAll: isCheckedAll(state, props.listId),
        };
    }
)
export default class CheckBoxColumn extends React.Component {

    static propTypes = {
        item: PropTypes.object,
        listId: PropTypes.stirng,
        itemId: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        isChecked: PropTypes.bool,
        isCheckedAll: PropTypes.bool,
        inHeader: PropTypes.bool,
    };

    render() {
        return (
            <CheckboxField
                input={{
                    name: 'id',
                    value: this.props.inHeader
                        ? this.props.isCheckedAll
                        : this.props.isChecked,
                    onChange: () => {
                        this.props.dispatch(
                            this.props.inHeader
                                ? toggleAll(this.props.listId)
                                : toggleItem(this.props.listId, this.props.itemId)
                        );
                    }
                }}
            />
        );
    }

}
