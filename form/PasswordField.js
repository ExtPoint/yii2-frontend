import React from 'react';
import PropTypes from 'prop-types';

import {view} from 'components';

export default class PasswordField extends React.Component {

    static propTypes = {
        metaItem: PropTypes.object.isRequired,
        input: PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.any,
            onChange: PropTypes.func,
        }),
        readOnly: PropTypes.bool,
        securityLevel: PropTypes.bool,
        onChange: PropTypes.func,
    };

    constructor() {
        super(...arguments);

        this._onChange = this._onChange.bind(this);

        this.state = {
            type: 'password',
            level: '',
            error: '',
        };
    }

    render() {
        const {input, disabled, placeholder, ...props} = this.props;
        const PasswordFieldView = this.props.view || view.getFormView('PasswordFieldView');
        return (
            <PasswordFieldView
                {...props}
                inputProps={{
                    name: input.name,
                    type: this.state.type,
                    disabled,
                    placeholder,
                    onChange: this._onChange,
                    value: input.value,
                }}
                isShowSecurity={this.props.securityLevel}
                securityLevel={this.state.level}
                securityMessage={this.state.error}
                onShowPassword={() => this.setState({type: 'text'})}
                onHidePassword={() => this.setState({type: 'password'})}
            />
        );
    }

    _onChange(e) {
        const value = e.target.value;

        this.props.input.onChange(value);
        if (this.props.onChange) {
            this.props.onChange(value);
        }

        if (this.props.securityLevel) {
            const [level, error] = PasswordField.checkPassword(value);
            this.setState({
                level,
                error
            });
        }
    }

    static checkPassword(password) {
        const s_letters = 'qwertyuiopasdfghjklzxcvbnm'; // Буквы в нижнем регистре
        const b_letters = 'QWERTYUIOPLKJHGFDSAZXCVBNM'; // Буквы в верхнем регистре
        const digits = '0123456789'; // Цифры
        const specials = '!@#$%^&*()_-+=\|/.,:;[]{}'; // Спецсимволы
        let is_s = false; // Есть ли в пароле буквы в нижнем регистре
        let is_b = false; // Есть ли в пароле буквы в верхнем регистре
        let is_d = false; // Есть ли в пароле цифры
        let is_sp = false; // Есть ли в пароле спецсимволы
        let is_rus = false;
        for (let i = 0; i < password.length; i++) {
            /* Проверяем каждый символ пароля на принадлежность к тому или иному типу */
            if (!is_s && s_letters.indexOf(password[i]) !== -1) {
                is_s = true;
            }
            else if (!is_b && b_letters.indexOf(password[i]) !== -1) {
                is_b = true;
            }
            else if (!is_d && digits.indexOf(password[i]) !== -1) {
                is_d = true;
            }
            else if (!is_sp && specials.indexOf(password[i]) !== -1) {
                is_sp = true;
            }
            else if (!is_sp && password[i].search(/^\w+$/)) {
                is_rus = true;
            }
        }

        let error = 'Пароль слишком короткий, ' + password.length + ' символов.';
        let level = '';

        let rating = 0;
        if (is_s) {
            rating++; // Если в пароле есть символы в нижнем регистре, то увеличиваем рейтинг сложности
        }
        if (is_b) {
            rating++; // Если в пароле есть символы в верхнем регистре, то увеличиваем рейтинг сложности
        }
        if (is_d) {
            rating++; // Если в пароле есть цифры, то увеличиваем рейтинг сложности
        }
        if (is_sp) {
            rating++; // Если в пароле есть спецсимволы, то увеличиваем рейтинг сложности
        }

        /* Далее идёт анализ длины пароля и полученного рейтинга, и на основании этого готовится текстовое описание сложности пароля */
        if (password.length <= 6 && rating < 3) {
            if (password.length > 0) {
                level = 'easy';
            }
        }
        else if (password.length <= 8 && rating < 4 && password.length > 6) {
            level = 'easy';
        }
        else if (password.length >= 8 && rating >= 3) {
            error = '';
            level = 'hard';
        } else if (password.length >= 8) {
            error = '';
            level = 'medium';
        }

        if (is_rus) {
            error = 'Пароль содержит запрещенные символы';
        }

        return [level, error];
    }

}
