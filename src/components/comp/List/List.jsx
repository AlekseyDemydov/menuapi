import s from './List.module.scss';
import React, { useState } from 'react';
import config from 'config';
import oops from './img/oops.webp';
import Like from '../Like/Like';
import Comments from '../Comments/Comments';

export const List = ({
  data,
  onModal,
  subcategory,
  category,
  categoryId,
  subcategoryId,
}) => {
  const [localComments, setLocalComments] = useState(
    data.reduce((acc, item) => {
      acc[item._id] = item.comments || [];
      return acc;
    }, {})
  );
const isAuthenticated = !!localStorage.getItem('token');

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
            {e.isNew && (
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
              {e.price}
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
      </div>
    </div>
  ));
};
