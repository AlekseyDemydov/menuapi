import React, { useState } from 'react';
import s from './Login.module.scss';
import axios from 'axios';
import config from 'config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
        `${config.baseURL}/auth/login`,
        formData
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('fullName', response.data.user.fullName);
      localStorage.setItem('userId', response.data.user._id);

      setMessage({ text: 'Успішний вхід!', type: 'success' });

      navigate('/');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Помилка при вході';
      setMessage({ text: errMsg, type: 'error' });
    }
  };

  return (
    <div className={s.login}>
      <form className={s.login__form} onSubmit={handleSubmit}>
        <h2 className={s.login__title}>Вхід до кабінету</h2>

        <div className={s.login__group}>
          <label className={s.login__label} htmlFor="email">
            Email
          </label>
          <input
            className={s.login__input}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={s.login__group}>
          <label className={s.login__label} htmlFor="password">
            Пароль
          </label>
          <input
            className={s.login__input}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={s.login__button}>
          Увійти
        </button>

        {message.text && (
          <p
            className={`${s.login__message} ${s[`login__message--${message.type}`]}`}
          >
            {message.text}
          </p>
        )}
        <p>Якщо у вас немає акаунту ви можете зареєструватись</p>
        <button
          type="button"
          className={s.login__registerBtn}
          onClick={() => navigate('/auth/register')}
        >
          Зареєструватися
        </button>
      </form>
    </div>
  );
};

export default Login;
