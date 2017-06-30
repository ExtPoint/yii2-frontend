import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';

const bem = html.bem('SwitcherFieldView');

export default class SwitcherFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
            label: PropTypes.string,
            isSelected: PropTypes.bool,
            onClick: PropTypes.func,
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
                            className={bem(
                                bem.element('item'),
                                bem.element('item', {selected: item.isSelected})
                            )}
                            onClick={item.onClick}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </FieldWrapper>
        );
    }

}
