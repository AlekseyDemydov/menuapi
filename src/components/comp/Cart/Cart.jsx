import React from 'react';
import { useCart } from 'react-use-cart';
import { Link } from 'react-router-dom';
import s from './Cart.module.scss';

const Cart = () => {
  const { items, removeItem, emptyCart, cartTotal, isEmpty } = useCart();

  if (isEmpty) return <p>Кошик порожній</p>;

  return (
    <div className={s.cartWrapper}>
      <h2 className={s.cartTitle}>Ваше замовлення</h2>
      <ul className={s.cartList}>
        {items.map(item => (
          <li className={s.cartItem} key={item.id}>
            <div className={s.itemInfo}>
              <span>{item.name}</span>
              <span className={s.price}>{item.price} грн</span>
              <span className={s.quantity}>{item.quantity} шт</span>
            </div>
            <button className={s.removeBtn} onClick={() => removeItem(item.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <p className={s.total}>Загалом: {cartTotal} грн</p>
      <button className={s.clearCartBtn} onClick={emptyCart}>
        Очистити кошик
      </button>
      <Link to="/order">
        <button className={s.checkoutBtn}>Оформити замовлення</button>
      </Link>
    </div>
  );
};

export default Cart;
