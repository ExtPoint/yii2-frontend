import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('FieldErrorView');

export default class FieldErrorView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
    };

    render() {
        return (
            <p
                className={bem(
                    bem.block(),
                    'help-block help-block-error',
                    this.props.className,
                )}
            >
                {this.props.error}
            </p>
        );
    }

}