import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('PaginationMoreView');

export default class PaginationMoreView extends React.Component {

    static propTypes = {
        label: PropTypes.string,
    };

    static defaultProps = {
        label: 'Показать еще',
    };

    render() {
        if (this.props.currentPage >= this.props.totalPages) {
            return null;
        }

        return (
            <div className={bem.block()}>
                <button
                    type='button'
                    className={bem.element('button')}
                    onClick={() => this.props.onSelect(this.props.currentPage + 1)}
                >
                    {this.props.label}
                </button>
            </div>
        );
    }

}