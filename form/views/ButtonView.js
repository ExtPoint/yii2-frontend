import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('ButtonView');

export default class ButtonView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        buttonProps: PropTypes.object,
        icon: PropTypes.string,
        color: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
        size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
        disabled: PropTypes.bool,
        submitting: PropTypes.bool,
    };

    render() {
        return (
            <button
                {...this.props.buttonProps}
                className={bem(
                    bem.block(),
                    bem.block({
                        color: this.props.color,
                        size: this.props.size,
                        disabled: this.props.disabled,
                        submitting: this.props.submitting,
                    }),
                    this.props.className,
                    'btn',
                    'btn-' + this.props.size,
                    'btn-' + this.props.color,
                )}
                disabled={this.props.disabled || this.props.submitting}
            >
                {this.props.icon && (
                    <span
                        className={bem(
                            bem.element('icon'),
                            this.props.icon,
                        )}
                    />
                )}
                {this.props.children}
            </button>
        );
    }

}
