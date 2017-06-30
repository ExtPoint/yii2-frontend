import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('MoneyFieldView');

export default class MoneyFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        currency: PropTypes.string,
        inputProps: PropTypes.object,
        onEdit: PropTypes.func,
    };

    static icons = ['RUB', 'USD', 'EUR', 'BTC', 'XBT', 'YEN', 'JPY', 'GBP'];

    render() {
        return (
            <FieldWrapper
                {...this.props}
                className={bem(
                    bem.block(),
                    this.props.className,
                )}
            >
                <div
                    className={bem(
                        bem.element('container'),
                        this.props.currency && 'input-group',
                    )}
                >
                    <input
                        {...this.props.inputProps}
                        className={bem(bem.element('input'), 'form-control')}
                    />
                    {this.props.currency && (
                        <div className='input-group-addon'>
                            {MoneyFieldView.icons.indexOf(this.props.currency) !== -1
                                ? <span className={'glyphicon glyphicon-' + this.props.currency.toLowerCase()} />
                                : this.props.currency}
                        </div>
                    )}
                </div>
            </FieldWrapper>
        );
    }

}
