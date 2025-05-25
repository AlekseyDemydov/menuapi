import s from './List.module.scss';
import React, { useState } from 'react';
import config from 'config';
import oops from './img/oops.webp';
import Like from '../Like/Like';
import Comments from '../Comments/Comments';
import { useCart } from 'react-use-cart';

export const List = ({
  data,
  onModal,
  subcategory,
  category,
  categoryId,
  subcategoryId,
}) => {
  const { addItem, updateItemQuantity, getItem } = useCart();

  const [quantities, setQuantities] = useState(
    data.reduce((acc, item) => {
      acc[item._id] = 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (productId, value) => {
    const qty = Math.max(1, Number(value) || 1);
    setQuantities(prev => ({
      ...prev,
      [productId]: qty,
    }));
  };

  const incrementQuantity = productId => {
    setQuantities(prev => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
  };

  const decrementQuantity = productId => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, prev[productId] - 1),
    }));
  };

  const [localComments, setLocalComments] = useState(
    data.reduce((acc, item) => {
      acc[item._id] = item.comments || [];
      return acc;
    }, {})
  );
  const isAuthenticated = !!localStorage.getItem('token');
const handleAddToCart = (itemId, product) => {
  const qty = quantities[itemId];
  const itemInCart = getItem(itemId);
  if (itemInCart) {
    updateItemQuantity(itemId, itemInCart.quantity + qty);
  } else {
    addItem(product, qty);
  }
};
  const handleAddComment = async (productId, text) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const fullName = localStorage.getItem('fullName');

      const res = await fetch(
        `${config.baseURL}/api/categories/${categoryId}/subcategories/${subcategoryId}/products/${productId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, fullName, text }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Помилка сервера:', errorData);
        throw new Error('Помилка при додаванні коментаря');
      }

      const newComment = await res.json();

      setLocalComments(prev => ({
        ...prev,
        [productId]: [...prev[productId], newComment],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const highlightUnits = text => {
    return text.replace(/(\d+\s*(г|мл))/gi, '<span class="number">$1</span>');
  };
  return data.map(e => (
    <div key={e._id}>
      <div
        onClick={() =>
          onModal(e.title, e.price, e.text, e.src, e.description, e.zvd)
        }
        className={s.item}
      >
        <img
          src={`${config.baseURL}${e.src || oops}`}
          alt={e.title}
          className={`${s.sizeImg} ${category === 'Краш меню' ? s.music : ''}`}
          crossOrigin="anonymous"
          loading="lazy"
        />

        <div className={s.itemBox}>
          <div className={s.itemMain}>
            <h3
              className={`${s.title} ${subcategory === 'ПИВО' ? s.beer : ''}`}
              dangerouslySetInnerHTML={{ __html: highlightUnits(e.title) }}
            />
            {e.isNewProduct && (
              <span
                className={`${s.newWord} ${subcategory === 'ПИВО' ? s.newWordBeer : ''}`}
              >
                NEW
              </span>
            )}
            <p className={s.text}>{e.text}</p>
          </div>
          <div className={s.boxPrice}>
            <h3
              className={`${s.price} ${subcategory === 'ПИВО' ? s.widthPrice : ''}`}
            >
              {e.price} грн
            </h3>
            {e.price2 && (
              <h3
                className={`${s.price} ${subcategory === 'ПИВО' ? s.widthPrice : ''}`}
              >
                {e.price2}
              </h3>
            )}
          </div>
        </div>
      </div>
      <div className={s.userInteraction}>
        <Like
          likes={e.likes}
          productId={e._id}
          categoryId={categoryId}
          subcategoryId={subcategoryId}
        />
        <Comments
          comments={localComments[e._id]}
          productId={e._id}
          onAddComment={text => handleAddComment(e._id, text)}
          isAuthenticated={isAuthenticated}
        />
        <div className={s.quantityControl}>
          <button
            className={s.qtyBtn}
            onClick={() => decrementQuantity(e._id)}
            aria-label="Зменшити кількість"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={quantities[e._id]}
            onChange={e => handleQuantityChange(e._id, e.target.value)}
            className={s.quantityInput}
          />
          <button
            className={s.qtyBtn}
            onClick={() => incrementQuantity(e._id)}
            aria-label="Збільшити кількість"
          >
            +
          </button>
        </div>

        <button
          className={s.addToCartBtn}
          onClick={() =>
            handleAddToCart(e._id, {
              id: e._id,
              price: e.price,
              name: e.title,
              text: e.text,
              img: e.src,
              zvd: e.zvd,
            })
          }
        >
          Додати до кошика
        </button>
      </div>
    </div>
  ));
};
