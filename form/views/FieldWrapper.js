import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldLabelView from './FieldLabelView';
import FieldHintView from './FieldHintView';
import FieldErrorView from './FieldErrorView';

const bem = html.bem('FieldWrapper');

export default class FieldWrapper extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        labelProps: PropTypes.object,
        hintProps: PropTypes.object,
        errorProps: PropTypes.object,
        layout: PropTypes.string,
        layoutCols: PropTypes.arrayOf(PropTypes.number),
    };

    render() {
        if (this.props.layout === 'inline') {
            return (
                <div
                    className={bem(
                        bem.block(),
                        this.props.className,
                    )}
                >
                    {this.props.children}
                </div>
            );
        }

        return (
            <div
                className={bem(
                    bem.block(),
                    bem.block({layout: this.props.layout}),
                    this.props.className,
                    'form-group',
                )}
            >
                {this.props.labelProps && (
                    <FieldLabelView {...this.props.labelProps} />
                )}
                <div
                    className={bem(
                        bem.element('container'),
                        this.props.layout === 'horizontal' && 'col-sm-' + this.props.layoutCols[1],
                        this.props.layout === 'horizontal' && !this.props.labelProps && 'col-sm-offset-' + this.props.layoutCols[0],
                    )}
                >
                    {this.props.children}
                </div>
                {this.props.hintProps && (
                    <FieldHintView {...this.props.hintProps} />
                )}
                {this.props.errorProps && (
                    <FieldErrorView {...this.props.errorProps} />
                )}
            </div>
        );
    }

}