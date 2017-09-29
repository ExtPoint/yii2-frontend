import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('DropDownFieldView');

export default class DropDownFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        inputProps: PropTypes.object,
        searchInputProps: PropTypes.object,
        isOpened: PropTypes.bool,
        isShowSearch: PropTypes.bool,
        searchHint: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            label: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            isChecked: PropTypes.bool,
            isHovered: PropTypes.bool,
            isShowCheckbox: PropTypes.bool,
            onClick: PropTypes.func,
            onMouseOver: PropTypes.func,
        })),
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
                <div className={bem(bem.element('container'), 'dropdown')}>
                    <span className={bem(bem.element('caret'), 'caret')}/>
                    <input
                        {...this.props.inputProps}
                        className={bem(bem.element('input'), 'form-control')}
                    />
                    {this.props.isOpened && (
                        this.renderDropDown()
                    )}
                </div>
            </FieldWrapper>
        );
    }

    renderDropDown() {
        return (
            <div className={bem(bem.element('dropdown'), 'dropdown-menu')}>
                {this.props.isShowSearch && (
                    <div className={bem.element('search')}>
                        <input
                            {...this.props.searchInputProps}
                            className={bem(bem.element('search-input'), 'form-control')}
                        />
                    </div>
                )}
                {this.props.searchHint && (
                    <div className={bem.element('auto-complete-hint')}>
                        {this.props.searchHint}
                    </div>
                )}
                <ul className={bem.element('dropdown-list')}>
                    {this.props.items.map(item => this.renderItem(item))}
                </ul>
            </div>
        );
    }

    renderItem(item) {
        return (
            <li
                key={item.id}
                className={bem(
                    bem.element('dropdown-item'),
                    bem.element('dropdown-item', {
                        active: item.isChecked,
                        hover: item.isHovered,
                    }),
                )}
                onClick={item.onClick}
                onMouseOver={item.onMouseOver}
            >
                {item.isShowCheckbox && (
                    <div className={bem.element('checkbox')}>
                        <input
                            {...item.inputProps}
                            className={bem.element('checkbox-input')}
                        />
                        <span className={bem.element('dropdown-label')}>
                            {item.label}
                        </span>
                    </div>
                ) ||
                (
                    <span className={bem.element('dropdown-label')}>
                        {item.label}
                    </span>
                )}
            </li>
        );
    }

}
