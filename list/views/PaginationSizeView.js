import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('PaginationSizeView');

export default class PaginationSizeView extends React.Component {

    static propTypes = {
        currentSize: PropTypes.number.isRequired,
        sizes: PropTypes.arrayOf(PropTypes.number),
        onSelect: PropTypes.func,
    };

    static defaultProps = {
        sizes: [30, 50, 100],
    };

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('label')}>
                    Выводить по:
                </div>
                <ul className={bem.element('sizes')}>
                    {this.props.sizes.map(size => (
                        <li
                            key={size}
                            className={bem(
                                bem.element('sizes-item'),
                                bem.element('sizes-item', {active: this.props.currentSize === size}),
                            )}
                        >
                            <a
                                href='javascript:void(0)'
                                className={bem.element('link')}
                                onClick={() => this._onClick(size)}
                            >
                                {size}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    _onClick(size) {
        if (this.props.onSelect) {
            this.props.onSelect(size);
        }
    }

}