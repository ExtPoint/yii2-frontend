import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import Tooltip from 'shared/tooltip/Tooltip';

const bem = html.bem('FieldLabelView');

export default class FieldLabelView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        label: PropTypes.string,
        hint: PropTypes.string,
        required: PropTypes.bool,
        onClick: PropTypes.func,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
    };

    render() {
        return (
            <label
                className={bem(
                    bem.block(),
                    bem.block({required: this.props.required}),
                    this.props.className,
                    'control-label',
                    this.props.layout === 'horizontal' && 'col-sm-' + this.props.layoutCols[0],
                )}
                onClick={this.props.onClick}
            >
                {this.props.label || this.props.children || <span>&nbsp;</span>}
                {this.props.hint && (
                    <Tooltip text={this.props.hint}>
                        <span className={bem.element('hint')}/>
                    </Tooltip>
                )}
            </label>
        );
    }

}