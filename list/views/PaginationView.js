import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('PaginationView');

export default class PaginationView extends React.Component {

    static propTypes = {
        currentPage: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        aroundCount: PropTypes.number.isRequired,
        onSelect: PropTypes.func,
    };

    static defaultProps = {
        aroundCount: 3,
    };

    static generatePages(page, total, aroundCount) {
        const pages = [];

        for (let i = 1; i <= total; i++) {
            // Store first and last
            if (i === 1 || i === total) {
                pages.push(i);
                continue;
            }

            // Store around
            if (page - aroundCount < i && i < page + aroundCount) {
                pages.push(i);
                continue;
            }

            if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages;
    }

    render() {
        return (
            <ul className={bem(bem.block(), 'pagination')}>
                {PaginationView.generatePages(this.props.currentPage, this.props.totalPages, this.props.aroundCount).map((page, i) => (
                    <li
                        key={i}
                        className={bem(
                            bem.element('page'),
                            page === '...' ? bem.element('page', 'hidden') : '',
                            page === this.props.currentPage ? 'active' : ''
                        )}
                    >
                        <a
                            className={bem(
                                bem.element('page-link'),
                                page === '...' ? bem.element('page-link', 'hidden') : '',
                            )}
                            href='javascript:void(0)'
                            onClick={() => this._onClick(page)}
                        >
                            {page}
                        </a>
                    </li>
                ))}
            </ul>
        );
    }

    _onClick(page) {
        if (page !== '...' && this.props.onSelect) {
            this.props.onSelect(page);
        }
    }

}