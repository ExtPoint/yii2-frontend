import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('RangeFieldView');

export default class RangeFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        fromProps: PropTypes.object,
        toProps: PropTypes.object,
        renderField: PropTypes.func,
        separator: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
    };

    static defaultProps = {
        separator: '—',
    };

    render() {
        return (
            <FieldWrapper
                {...this.props}
                className={bem(
                    bem.block(),
                    this.props.className,
                )}
            >
                <div className={bem(bem.element('container'), 'row')}>
                    <div className='col-sm-6'>
                        {this.props.renderField(this.props.fromProps)}
                    </div>
                    <div className={bem.element('separator')}>
                        {this.props.separator}
                    </div>
                    <div className='col-sm-6'>
                        {this.props.renderField(this.props.toProps)}
                    </div>
                </div>
            </FieldWrapper>
        );
    }

}
