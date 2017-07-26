import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('GridView');

export default class GridRowView extends React.Component {

    static propTypes = {
        rowColumns: PropTypes.arrayOf(PropTypes.shape({
            className: PropTypes.string,
            textCenter: PropTypes.bool,
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
                PropTypes.element,
            ]),
        })),
        colSpan: PropTypes.number,
    };

    render() {
        return (
            <tr
                colSpan={this.props.colSpan}
                className={bem.element('table-row', 'body')}
            >
                {this.props.rowColumns.map((column, index) => (
                    <td
                        key={index}
                        className={bem(
                            bem.element('cell', {center: column.textCenter}),
                            column.className,
                        )}
                    >
                        {column.value}
                    </td>
                ))}
            </tr>
        );
    }

}