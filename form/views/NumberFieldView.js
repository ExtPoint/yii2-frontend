import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('NumberFieldView');

export default class NumberFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        inputProps: PropTypes.object,
        showButtons: PropTypes.bool,
        onPlus: PropTypes.func,
        onMinus: PropTypes.func,
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
                <div className={bem.element('container')}>
                    <input
                        {...this.props.inputProps}
                        className={bem(bem.element('input'), 'form-control')}
                    />
                    {this.props.showButtons && (
                        <div className={bem.element('buttons-group')}>
                            <button
                                type='button'
                                className={bem(bem.element('button-plus'), 'btn btn-default')}
                                onClick={this.props.onPlus}
                            >
                                <span className='glyphicon glyphicon-menu-up' />
                            </button>
                            <button
                                type='button'
                                className={bem(bem.element('button-minus'), 'btn btn-default')}
                                onClick={this.props.onMinus}
                            >
                                <span className='glyphicon glyphicon-menu-down' />
                            </button>
                        </div>
                    )}
                </div>
            </FieldWrapper>
        );
    }

}
