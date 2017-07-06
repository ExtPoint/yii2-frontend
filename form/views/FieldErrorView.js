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
            <div
                className={bem(
                    bem.block(),
                    this.props.className,
                )}
            >
                {this.props.error}
            </div>
        );
    }

}