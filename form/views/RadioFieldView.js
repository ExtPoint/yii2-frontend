import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('RadioFieldView');

export default class RadioFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        inputProps: PropTypes.object,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            isChecked: PropTypes.bool,
            label: PropTypes.string,
            onSelect: PropTypes.func,
        })),
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
                <div className={bem.element('list')}>
                    {this.props.items.map(item => (
                        <div
                            key={item.id}
                            onClick={item.onSelect}
                            className={bem(
                                bem.element('item'),
                                bem.element('item', {checked: item.isChecked})
                            )}
                        >
                            <label className={bem.element('item-label')}>
                                <input
                                    {...this.props.inputProps}
                                    className={bem.element('item-input')}
                                />
                                <span className={bem.element('item-text')}>
                                    {item.label}
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
            </FieldWrapper>
        );
    }

}
