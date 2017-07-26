import React from 'react';
import Collapse from 'react-bootstrap/lib/Collapse';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('SearchView');

export default class SearchView extends React.Component {

    static propTypes = {
        rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.element,
        }))),
        columnsCount: PropTypes.number,
        onReset: PropTypes.func,
    };

    static defaultProps = {
        columnsCount: 4,
    };

    constructor() {
        super(...arguments);

        this.state = {
            isOpened: false,
        };
    }

    render() {
        return (
            <div className={bem.block()}>
                <div className={bem.element('toggle-control')}>
                    Фильтры
                    <div
                        className={bem.element('toggle-control-button')}
                        onClick={() => this.setState({isOpened: !this.state.isOpened})}
                    >
                        {this.state.isOpened ? 'Скрыть' : 'Показать'}
                    </div>
                    {this.state.isOpened && (
                        <div
                            className={bem.element('reset-button')}
                            onClick={this.props.onReset}
                        >
                            Очистить
                        </div>
                    )}
                </div>
                <Collapse in={this.state.isOpened}>
                    <div className={bem.element('container')}>
                        {this.props.rows.map((columns, rowIndex) => (
                            <div key={rowIndex} className='row'>
                                {columns.map((column, columnIndex) => (
                                    <div
                                        key={columnIndex}
                                        className={'col_' + Math.floor(12 / this.props.columnsCount)}
                                    >
                                        {column.field}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </Collapse>
            </div>
        );
    }

}