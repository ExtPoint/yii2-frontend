import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import Tooltip from 'shared/tooltip/Tooltip';

const bem = html.bem('GridView');

export default class GridTableView extends React.Component {

    static propTypes = {
        headerColumns: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.element
            ]),
            hint: PropTypes.string,
            className: PropTypes.string,
            textCenter: PropTypes.bool,
            sortable: PropTypes.bool,
            direction: PropTypes.oneOf(['asc', 'desc']),
            onSortAsc: PropTypes.func,
            onSortDesc: PropTypes.func,
        })),
        items: PropTypes.arrayOf(PropTypes.element),
        empty: PropTypes.element,
    };

    render() {
        return (
            <div className='table-responsive'>
                <table className={bem(bem.element('table'), 'table', 'table-striped')}>
                    <thead className={bem.element('table-head')}>
                        <tr className={bem(bem.element('table-row', 'head'), bem.element('table-row'))}>
                            {this.props.headerColumns.map((column, index) => (
                                <th
                                    key={index}
                                    className={bem(
                                        bem.element('cell', {
                                            center: column.textCenter,
                                            sortable: column.sortable,
                                        }),
                                        column.className,
                                    )}
                                >
                                    {column.title}
                                    {column.hint && (
                                        <div className={bem.element('hint')}>
                                            <Tooltip text={column.hint}>
                                                <span className='Icon Icon_help'/>
                                            </Tooltip>
                                        </div>
                                    )}
                                    {column.sortable && (
                                        <div className={bem.element('sort-actions')}>
                                            <a
                                                href='javascript:void(0)'
                                                className={bem.element('sort-icon-asc', {active: column.direction === 'asc'})}
                                                onClick={column.onSortAsc}
                                            />
                                            <a
                                                href='javascript:void(0)'
                                                className={bem.element('sort-icon-desc', {active: column.direction === 'desc'})}
                                                onClick={column.onSortDesc}
                                            />
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={bem.element('table-body')}>
                        {this.props.items}
                        {this.props.empty}
                    </tbody>
                </table>
            </div>
        );
    }

}