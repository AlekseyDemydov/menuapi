import React, { useState, useEffect } from 'react';
import s from './Comments.module.scss';
import mess from './img/messs.png';

const Comments = ({ comments = [], onAddComment, isAuthenticated }) => {
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await onAddComment(newComment); // викликає функцію з List.jsx
      setNewComment('');
    } catch (err) {
      console.error('Помилка при додаванні коментаря:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className={s.iconWrapper} onClick={() => setIsOpen(true)}>
        <img src={mess} alt="Коментарі" className={s.icon} />
        <span className={s.counter}>{comments.length}</span>
      </div>

      {isOpen && (
        <div className={s.modalOverlay} onClick={() => setIsOpen(false)}>
          <div className={s.modalWindow} onClick={e => e.stopPropagation()}>
            <button className={s.closeButton} onClick={() => setIsOpen(false)}>×</button>
            <div className={s.comments}>
              <div className={s.list}>
                {comments.length === 0 && <p>Немає коментарів</p>}
                {comments.map(comment => (
                  <div key={comment._id || comment.text} className={s.comment}>
                    <strong>{comment.fullName || 'Гість'}</strong>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>

              {isAuthenticated ? (
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
              ) : (
                <p className={s.loginNotice}>Увійдіть в систему, щоб залишити коментар</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comments;
