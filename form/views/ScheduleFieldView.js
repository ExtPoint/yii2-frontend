import React from 'react';
import PropTypes from 'prop-types';

import {html} from 'components';
import FieldWrapper from './FieldWrapper';
import DropDownField from '../DropDownField';

const bem = html.bem('ScheduleFieldView');

export default class ScheduleFieldView extends React.Component {

    static propTypes = {
        className: PropTypes.string,
        weekDays: PropTypes.arrayOf(PropTypes.shape({
            index: PropTypes.number,
            label: PropTypes.string,
            isSelected: PropTypes.bool,
            onClick: PropTypes.func,
        })),
        onAllTimeClick: PropTypes.func,
        onEverydayClick: PropTypes.func,
        sinceHourProps: PropTypes.object,
        sinceMinuteProps: PropTypes.object,
        tillHourProps: PropTypes.object,
        tillMinuteProps: PropTypes.object,
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
                <div className={bem.element('days-container')}>
                    <a
                        className={bem.element('everyday')}
                        onClick={this.props.onEverydayClick}
                    >
                        ежедневно
                    </a>
                    <div className={bem.element('week')}>
                        {this.props.weekDays.map(item => (
                            <a
                                key={item.index}
                                className={bem(
                                    bem.element('week-day'),
                                    bem.element('week-day', {
                                        active: item.isSelected,
                                    })
                                )}
                                onClick={item.onClick}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
                <div className={bem.element('time-container')}>
                    <div className={bem.element('since')}>
                        <span className={bem.element('since-label')}>с</span>
                        <DropDownField {...this.props.sinceHourProps} />
                        <span className={bem.element('since-separator')}>:</span>
                        <DropDownField {...this.props.sinceMinuteProps} />
                    </div>
                    <div className={bem.element('till')}>
                        <span className={bem.element('till-label')}>до</span>
                        <DropDownField {...this.props.tillHourProps} />
                        <span className={bem.element('since-separator')}>:</span>
                        <DropDownField {...this.props.tillMinuteProps} />
                    </div>
                    <div className={bem.element('alltime')}>
                        <a
                            onClick={this.props.onAllTimeClick}
                        >
                            круглосуточно
                        </a>
                    </div>
                </div>
            </FieldWrapper>
        );
    }

}
