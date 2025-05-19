import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import config from 'config';
import s from './Like.module.scss';

const Like = ({ likes = [], productId, categoryId, subcategoryId }) => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [isLiked, setIsLiked] = useState(likes.includes(userId));
  const [likesCount, setLikesCount] = useState(likes.length);

  const handleLike = async () => {
    try {
      const res = await axios.patch(
        `${config.baseURL}/api/products/categories/${categoryId}/subcategories/${subcategoryId}/products/${productId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikesCount(res.data.likesCount);
      setIsLiked(res.data.liked);
    } catch (err) {
      console.error('Помилка лайку:', err);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`${s.likeButton} ${isLiked ? s.liked : s.unliked}`}
      aria-label={isLiked ? 'Відмінити лайк' : 'Поставити лайк'}
    >
      {isLiked ? '💖' : '🤍'}

      <AnimatePresence mode="wait">
        <motion.span
          key={likesCount}
          initial={{ y: likesCount > 0 ? -20 : 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: likesCount > 0 ? 20 : -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={s.likesCount}
        >
          {likesCount}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default Like;
