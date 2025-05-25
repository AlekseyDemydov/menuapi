import React, { useState } from 'react';
import s from './Register.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from 'config';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '+380', // початкове значення з кодом України
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    let { name, value } = e.target;

    if (name === 'phone') {
      // Забороняємо стерти +380, якщо користувач починає вводити телефон
      if (!value.startsWith('+380')) {
        value = '+380';
      }
      // Дозволяємо тільки цифри після +380
      const onlyNumbers = value.slice(4).replace(/\D/g, '');

      // Обмежуємо довжину введення 9 цифр після +380
      const trimmedNumbers = onlyNumbers.slice(0, 9);

      value = '+380' + trimmedNumbers;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.post(
        `${config.baseURL}/auth/register`,
        formData
      );
      setMessage({ text: 'Реєстрація успішна!', type: 'success' });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('fullName', response.data.user.fullName);
      localStorage.setItem('userId', response.data.user._id);
      setTimeout(() => {
        navigate('/');
      }, 400);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      if (error.response) {
        const errMsg = error.response.data.message || '';

        if (errMsg.toLowerCase().includes('email')) {
          setMessage({ text: 'Цей email вже зареєстрований', type: 'error' });
        } else if (errMsg.toLowerCase().includes('phone')) {
          setMessage({
            text: 'Цей телефон вже зареєстрований або некоректний',
            type: 'error',
          });
        } else {
          setMessage({
            text: errMsg || 'Помилка при реєстрації',
            type: 'error',
          });
        }
      } else {
        setMessage({ text: 'Помилка при реєстрації', type: 'error' });
      }
    }
  };

  return (
    <div className={s.register}>
      <form className={s.register__form} onSubmit={handleSubmit}>
        <h2 className={s.register__title}>Реєстрація</h2>

        <div className={s.register__group}>
          <label className={s.register__label} htmlFor="fullName">
            Ім’я
          </label>
          <input
            className={s.register__input}
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={s.register__group}>
          <label className={s.register__label} htmlFor="phone">
            Телефон
          </label>
          <input
            className={s.register__input}
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="\+380\d{9}"
            required
          />
        </div>

        <div className={s.register__group}>
          <label className={s.register__label} htmlFor="email">
            Email
          </label>
          <input
            className={s.register__input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={s.register__group}>
          <label className={s.register__label} htmlFor="password">
            Пароль
          </label>
          <input
            className={s.register__input}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={s.register__button}>
          Зареєструватись
        </button>

        {message.text && (
          <p
            className={`${s.register__message} ${s[`register__message--${message.type}`]}`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;
