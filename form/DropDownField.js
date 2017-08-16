import React from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import enhanceWithClickOutside from 'react-click-outside';
import {connect} from 'react-redux';
import {change} from 'redux-form';
import _uniq from 'lodash/uniq';
import _remove from 'lodash/remove';
import _filter from 'lodash/filter';
import _isArray from 'lodash/isArray';
import _isString from 'lodash/isString';
import _isObject from 'lodash/isObject';
import _isUndefined from 'lodash/isUndefined';
import _find from 'lodash/find';

import {types, view} from 'components';
import {fetchByIds, fetchAutoComplete, cacheEntries} from 'actions/formList';
import {getLabels, getAutoComplete} from '../reducers/formList';

class DropDownField extends React.Component {

    static propTypes = {
        fieldId: PropTypes.string.isRequired,
        placeholder: PropTypes.string,
        searchPlaceholder: PropTypes.string,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        multiple: PropTypes.bool,
        disabled: PropTypes.bool,
        enumClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func,
        ]),
        autoComplete: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
            PropTypes.shape({
                method: PropTypes.string,
            }),
        ]),
        autoSelectFirst: PropTypes.bool,
        onChange: PropTypes.func,
        items: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                label: PropTypes.oneOfType([
                    PropTypes.number,
                    PropTypes.string,
                ]),
            })),
        ]),
        attribute: PropTypes.string,
        modelClass: PropTypes.string,
        autoCompleteItems: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            label: PropTypes.string,
        })),
        valueLabels: PropTypes.object,
    };

    static defaultProps = {
        placeholder: 'Выбрать',
        searchPlaceholder: 'Начните вводить символы для поиска...',
        autoSelectFirst: false,
    };

    constructor() {
        super(...arguments);

        this._onKeyDown = this._onKeyDown.bind(this);

        this.state = {
            query: '',
            isOpened: false,
            isFocused: false,
            hoveredValue: null,
        };

        this.initItems(this.props);
    }

    initItems(props) {
        let allItems = {};
        if (props.items) {
            allItems = props.items;
        } else if (props.enumClassName) {
            allItems = types.getEnumLabels(props.enumClassName);
        }

        // Convert to array
        if (!_isArray(allItems) && _isObject(allItems)) {
            allItems = Object.keys(allItems).map(key => ({
                id: key,
                label: allItems[key],
            }));
        }
        allItems = allItems.map(item => {
            return _isObject(item) ? item : {
                id: item,
                label: item,
            };
        });

        this.state.allItems = allItems;
        this.state.filteredItems = allItems;
    }

    componentWillMount() {
        const values = this.getValues();

        // Select first value on mount
        if (this.props.autoSelectFirst && this.props.input) {
            if (values.length === 0) {
                if (this.state.filteredItems.length > 0) {
                    const id = this.state.filteredItems[0].id;
                    const value = this.props.multiple ? [id] : id;
                    this.props.dispatch(change(this.props.formId, this.props.input.name, value));
                }
            }
        }

        // Async load selected labels from backend
        if (values.length > 0 && !this.getLabel()) {
            this.props.dispatch(fetchByIds(this.props.fieldId, values, {
                model: this.props.modelClass,
                attribute: this.props.attribute,
            }));
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this._onKeyDown);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.items !== nextProps.items) {
            this.initItems(nextProps);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.isOpened && !prevState.isOpened) {
            // Reset items on open
            this.setState({filteredItems: this.state.allItems});

            // Set focus on search input on open drop down
            if (this.props.autoComplete) {
                const searchInput = findDOMNode(this.refs.dropDown).querySelector('[type=search]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        }

        // Store entries in cache for render labels
        if (this.props.input && prevProps.input.value !== this.props.input.value) {
            const values = this.getValues();
            if (values.length > 0) {
                this.props.dispatch(cacheEntries(this.props.fieldId, values));
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this._onKeyDown);
    }

    handleClickOutside() {
        this.setState({
            isOpened: false
        });
    }

    getFilteredItems() {
        if (_isString(this.props.autoComplete) || _isObject(this.props.autoComplete)) {
            return this.props.autoCompleteItems || [];
        }
        return this.state.filteredItems;
    }

    /**
     * @return {[]}
     */
    getValues() {
        const value = this.props.input && this.props.input.value;
        if (!value && value !== 0) {
            return [];
        }
        return !_isArray(value) ? [value] : value;
    }

    /**
     * @return {string}
     */
    getLabel() {
        const values = this.getValues();
        if (values.length === 0) {
            return '';
        }

        const labels = [];
        const filteredItems = this.getFilteredItems();

        values.map(value => {
            if (this.props.valueLabels && [value]) {
                labels.push(this.props.valueLabels[value]);
            } else {
                const item = _find(filteredItems, item => item.id === value)
                    || _find(this.state.allItems, item => item.id === value);
                if (item) {
                    labels.push(item.label || item.id);
                }
            }
        });

        return labels.join(', ');
    }

    render() {
        const values = this.getValues();
        const {input, disabled, onChange, ...props} = this.props; // eslint-disable-line no-unused-vars
        const DropDownFieldView = this.props.view || view.getFormView('DropDownFieldView');
        return (
            <span>
                <DropDownFieldView
                    {...props}
                    ref='dropDown'
                    inputProps={{
                        type: 'text',
                        value: this.getLabel(),
                        placeholder: this.props.placeholder,
                        readOnly: true,
                        disabled,
                        onClick: () => !disabled && this.setState({isOpened: !this.state.isOpened})
                    }}
                    searchInputProps={{
                        type: 'search',
                        placeholder: 'Поиск',
                        onChange: e => this.search(e.target.value),
                        tabIndex: -1
                    }}
                    searchHint={(
                        (_isString(this.props.autoComplete) || _isObject(this.props.autoComplete)) && !this.state.query && this.props.autoCompleteItems && this.props.autoCompleteItems.length === 0
                            ? this.props.searchPlaceholder
                            : null
                    )}
                    onReset={!this.props.autoSelectFirst && values.length > 0 ? () => this._onChange(null) : null}
                    isOpened={this.state.isOpened}
                    isShowSearch={!!this.props.autoComplete}
                    items={this.getFilteredItems().map(item => ({
                        id: item.id,
                        label: item.label,
                        item,
                        isChecked: values.indexOf(item.id) !== -1,
                        isHovered: this.state.hoveredValue === item.id,
                        isShowCheckbox: this.props.multiple,
                        inputProps: {
                            type: 'checkbox',
                            checked: values.indexOf(item.id) !== -1,
                        },
                        onClick: () => this.toggleItem(item.id),
                        onMouseOver: () => this.setState({hoveredValue: item.id}),
                    }))}
                />
            </span>
        );
    }

    toggleItem(key) {
        const values = this.props.multiple ? _uniq(this.getValues().concat([key])) : [key];

        if (this.props.multiple) {
            const prevValues = this.getValues();
            const isSelected = prevValues.indexOf(key) !== -1;
            if (isSelected) {
                _remove(values, item => item === key);
            }
        }


        const value = this.props.multiple ? values : values[0];
        this._onChange(value);
        this.setState({
            isOpened: this.props.multiple ? this.state.isOpened : false,
        });
    }

    _onChange(value) {
        if (this.props.input) {
            this.props.input.onChange(value);
        }
        this.props.onChange && this.props.onChange(value);
    }

    /**
     * @param {string} query
     */
    search(query) {
        this.setState({query});

        query = query.toLowerCase();

        if (_isString(this.props.autoComplete) || _isObject(this.props.autoComplete)) {
            this.props.dispatch(fetchAutoComplete(this.props.fieldId, query, {
                ...this.props.autoComplete,
                model: this.props.modelClass,
                attribute: this.props.attribute,
            }));
        } else {
            this.setState({
                filteredItems: query
                    ? _filter(this.getFilteredItems(), item => item.label.toLowerCase().indexOf(query) === 0)
                    : this.state.allItems,
            });
        }
    }

    /**
     * @param {number} direction
     */
    moveHover(direction) {
        direction = direction > 0 ? 1 : -1;

        const keys = this.getFilteredItems().map(item => item.id);
        const index = this.state.hoveredValue ? keys.indexOf(this.state.hoveredValue) : -1;
        const newIndex = index !== -1 ? Math.min(keys.length - 1, Math.max(0, index + direction)) : 0;

        this.setState({
            hoveredValue: keys[newIndex],
        });

    }

    _onKeyDown(e) {
        if (!this.state.isFocused && !this.state.isOpened) {
            return;
        }

        switch (e.which) {
            case 9: // tab
            case 27: // esc
                e.preventDefault();

                this.setState({
                    isOpened: false,
                });
                break;

            case 13: // enter
                if (this.state.isOpened) {
                    e.preventDefault();

                    if (this.state.hoveredValue) {
                        this.toggleItem(this.state.hoveredValue);
                    } else {
                        // Select first result
                        const items = this.getFilteredItems();
                        if (items.length > 0) {
                            this.toggleItem(items[0].id);
                        }
                    }
                }
                break;

            case 38: // arrow up
                e.preventDefault();
                this.moveHover(-1);
                break;

            case 40: // arrow down
                e.preventDefault();

                if (!this.state.isOpened) {
                    this.setState({
                        isOpened: true,
                    });
                } else {
                    this.moveHover(1);
                }
                break;

        }
    }

}

export default connect(
    (state, props) => ({
        multiple: props.multiple || (props.metaItem ? props.metaItem.multiple : null),
        enumClassName: !_isUndefined(props.enumClassName) ? props.enumClassName : (props.metaItem ? props.metaItem.enumClassName : null),
        autoComplete: !_isUndefined(props.autoComplete) ? props.autoComplete : (props.metaItem ? props.metaItem.autoComplete : null),
        autoCompleteItems: getAutoComplete(state, props.fieldId),
        valueLabels: getLabels(state, props.fieldId, [].concat(props.input && props.input.value || [])),
    })
)(
    enhanceWithClickOutside(DropDownField)
);