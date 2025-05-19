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
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
