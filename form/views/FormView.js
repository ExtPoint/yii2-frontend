import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('FormView');

export default class FormView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        onSubmit: PropTypes.func,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
    };

    render() {
        return (
            <form
                className={bem(
                    bem.block(),
                    this.props.className,
                    this.props.layout === 'horizontal' && 'form-horizontal col-' + this.props.layoutCols[1],
                )}
                onSubmit={this.props.onSubmit}
            >
                {this.props.children}
            </form>
        );
    }

}
