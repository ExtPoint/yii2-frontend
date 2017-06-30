import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';

const bem = html.bem('FieldHintView');

export default class FieldHintView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        hint: PropTypes.string,
    };

    render() {
        return (
            <div
                className={bem(
                    bem.block(),
                    this.props.className,
                    'help-block',
                )}
            >
                {this.props.hint}
            </div>
        );
    }

}