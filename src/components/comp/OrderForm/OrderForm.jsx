import React, { useState } from 'react';
import { useCart } from 'react-use-cart';
import config from 'config';

export const OrderForm = () => {
  const { items, cartTotal, emptyCart } = useCart();
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const fullName = localStorage.getItem('fullName'); // <-- беремо ім’я

  const res = await fetch(`${config.baseURL}/auth/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      products: items,
      total: cartTotal,
      phone,
      fullName, // <-- додаємо в тіло запиту
    }),
  });

  if (res.ok) {
    setSuccess(true);
    emptyCart();
  } else {
    alert('Не вдалося оформити замовлення');
  }
};

  return success ? (
    <h2>Дякуємо за замовлення!</h2>
  ) : (
    <form onSubmit={handleSubmit}>
      <h2>Оформлення замовлення</h2>
      <input
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Ваш номер телефону"
        required
      />
      <button type="submit">Підтвердити</button>
    </form>
  );
};
