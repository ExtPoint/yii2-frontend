import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldLabelView from './FieldLabelView';
import FieldErrorView from './FieldErrorView';

const bem = html.bem('FieldsListView');

export default class FieldsListView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        errorProps: PropTypes.object,
        rows: PropTypes.arrayOf(PropTypes.shape({
            renderField: PropTypes.func,
        })),
        columns: PropTypes.arrayOf(PropTypes.shape({
            metaItem: PropTypes.object,
        })),
        onAdd: PropTypes.func,
        onRemove: PropTypes.func,
    };

    render() {
        return (
            <div
                className={bem(
                    bem.block(),
                    this.props.className,
                )}
            >
                <table className={bem.element('table')}>
                    <thead>
                    <tr className={bem.element('table-header')}>
                        {this.props.columns.map((column, index) => (
                            <th
                                key={index}
                                className={bem.element('table-header-row')}
                            >
                                {column.labelProps && (
                                    <FieldLabelView {...column.labelProps} />
                                )}
                            </th>
                        ))}
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={bem.element('table-row')}
                        >
                            {this.props.columns.map((column, columnIndex) => (
                                <td
                                    key={`${rowIndex}_${columnIndex}`}
                                    className={bem.element('table-cell')}
                                >
                                    {row.renderField(column)}
                                </td>
                            ))}
                            <td>
                                {rowIndex > 0 && (
                                    <a
                                        href='javascript:void(0)'
                                        className={bem.element('remove')}
                                        onClick={this.props.onRemove(rowIndex)}
                                    >
                                        &times;
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <FieldErrorView {...this.props.errorProps} />
                <a
                    href='javascript:void(0)'
                    className={bem.element('link-add')}
                    onClick={this.props.onAdd}
                >
                    Добавить ещё
                </a>
            </div>
        );
    }

}
