import React from 'react';
import PropTypes from 'prop-types';

import {form} from 'components';

export default class Button extends React.Component {

    static propTypes = {
        type: PropTypes.string,
        label: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
        onClick: PropTypes.func,
        icon: PropTypes.string,
        color: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
        size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
        disabled: PropTypes.bool,
        submitting: PropTypes.bool,
    };

    static defaultProps = {
        type: 'button',
        size: 'md',
        color: 'default',
    };

    render() {
        const {type, label, children, onClick, ...props} = this.props;
        const ButtonView = form.getViewComponent('ButtonView');

        return (
            <ButtonView
                {...props}
                buttonProps={{
                    type,
                    disabled: this.props.disabled,
                    onClick: onClick,
                }}
            >
                {label || children}
            </ButtonView>
        );
    }

}
