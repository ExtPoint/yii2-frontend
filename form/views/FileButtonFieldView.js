import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';
import Button from '../Button';

const bem = html.bem('FileButtonFieldView');

export default class FileButtonFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        buttonProps: PropTypes.object,
        buttonLabel: PropTypes.string,
        percent: PropTypes.string,
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
                <Button {...this.props.buttonProps}>
                    {this.props.buttonLabel}
                    {this.props.percent > 0 && (
                        <div className={bem.element('progress')}>
                            <div
                                className={bem.element('progress-bar')}
                                style={{
                                    width: this.props.percent + '%'
                                }}
                            />
                        </div>
                    )}
                </Button>
            </FieldWrapper>
        );
    }

}
