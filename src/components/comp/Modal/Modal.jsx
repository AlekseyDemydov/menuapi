import { useEffect, useState } from 'react';
import s from './Modal.module.scss';
import config from 'config';
import oops from '../List/img/oops.webp';

export const Modal = ({ objectModal, toggleModal }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        toggleModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleModal]);

  useEffect(() => {
    setIsImageLoading(true); // Скидання стану завантаження при зміні зображення
  }, [objectModal.src]);

  const handleCloseBackdrop = e => {
    if (e.target.nodeName !== 'DIV') return;
    toggleModal();
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  document.querySelectorAll('#itemTitle').forEach(el => {
    if (!el.innerHTML.includes('<span class="number">')) {
      const content = el.innerHTML;

      // Знаходимо числа з "г" або "мл" разом із можливим текстом після них
      const updatedContent = content.replace(
        /(\d+\s*(г|мл))/gi,
        '<span class="number">$1</span>'
      );

      el.innerHTML = updatedContent;
    }
  });
  console.log(objectModal)
  return (
    <div className={s.backdrop} onClick={handleCloseBackdrop}>
      <div className={s.modal}>
        {/* Кнопка для закриття модалки */}
        <button className={s.closeButton} onClick={toggleModal}>
          &times;
        </button>

        <img
          src={`${config.baseURL}${objectModal.src || oops}`}
          alt={objectModal.title || 'Image not available'}
          // className={s.imgSize}
          className={`${s.imgSize} ${objectModal.zvd !== 'room' ? s.imgSizeCoct : ''}`}
          onLoad={handleImageLoad}
          style={{ display: isImageLoading ? 'none' : 'block' }}
          crossOrigin="anonymous"
          loading="lazy"
        />

        <div>
          <h2 id="itemTitle" className={s.itemTitle}>
            {objectModal.title}
          </h2>
          <h3 className={s.itemPrice}>{objectModal.price}</h3>

          {objectModal.category === 'Бар' && (
            <div className={s.itemText}>{objectModal.text}</div>
          )}

          {objectModal.category !== 'Бар' && (
            <div className={s.itemText}>
              {objectModal.description?.trim()
                ? objectModal.description
                : objectModal.text}
            </div>
          )}
        </div>

        {isImageLoading && <div className={s.loader}>Loading...</div>}
      </div>
    </div>
  );
};
