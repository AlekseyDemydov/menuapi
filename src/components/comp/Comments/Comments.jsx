import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import s from './Comments.module.scss';
import config from 'config';

const Comments = ({ categoryId, subcategoryId, productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const baseUrl = `${config.baseURL}/api/products/categories/${categoryId}/subcategories/${subcategoryId}/products/${productId}/comments`;

  const fetchComments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(res.data);
    } catch (err) {
      console.error('Помилка при завантаженні коментарів:', err);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, fetchComments]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);

      const userId = localStorage.getItem('userId');
      const fullName = localStorage.getItem('fullName');
      const token = localStorage.getItem('token');
      console.log({
        text: newComment,
        userId,
        fullName,
      });
      await axios.post(
        `${config.baseURL}/api/products/categories/${categoryId}/subcategories/${subcategoryId}/products/${productId}/comments`,
        {
          text: newComment,
          userId,
          fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Помилка при додаванні коментаря:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button className={s.openButton} onClick={openModal}>
        Коментарі
      </button>{comments.length}

      {isOpen && (
        <div className={s.modalOverlay} onClick={closeModal}>
          <div className={s.modalWindow} onClick={e => e.stopPropagation()}>
            <button className={s.closeButton} onClick={closeModal}>
              ×
            </button>
            <div className={s.comments}>
              <div className={s.list}>
                {comments.length === 0 && <p>Немає коментарів</p>}
                {comments.map(comment => (
                  <div key={comment._id} className={s.comment}>
                    <strong>{comment.fullName}</strong>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className={s.form}>
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Напишіть коментар..."
                  className={s.input}
                  disabled={loading}
                />
                <button type="submit" disabled={loading} className={s.button}>
                  Надіслати
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;
