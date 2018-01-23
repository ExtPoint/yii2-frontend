import React from 'react';
import PropTypes from 'prop-types';

import {html, locale} from 'components';
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
        editable: PropTypes.bool,
        required: PropTypes.bool,
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
                                    className={bem(
                                        bem.element('table-header-row'),
                                        column.className
                                    )}
                                >
                                    {column.labelProps && (
                                        <FieldLabelView {...column.labelProps} />
                                    )}
                                </th>
                            ))}
                            {this.props.editable && (
                                <th />
                            )}
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
                                        className={bem(
                                            bem.element('table-cell'),
                                            column.className,
                                        )}
                                    >
                                        {row.renderField(column)}
                                    </td>
                                ))}
                                {this.props.editable && (
                                    <td>
                                        {(!this.props.required || rowIndex > 0) && (
                                            <a
                                                href='javascript:void(0)'
                                                className={bem.element('remove')}
                                                onClick={() => this.props.onRemove(rowIndex)}
                                            >
                                                &times;
                                            </a>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <FieldErrorView {...this.props.errorProps} />
                {this.props.editable && (
                    <a
                        href='javascript:void(0)'
                        className={bem.element('link-add')}
                        onClick={this.props.onAdd}
                    >
                        {locale.t('Добавить ещё')}
                    </a>
                )}
            </div>
        );
    }

}
