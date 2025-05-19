import s from './List.module.scss';
import config from 'config';
import oops from './img/oops.webp';
import Like from '../Like/Like';

export const List = ({
  data,
  onModal,
  subcategory,
  category,
  categoryId,
  subcategoryId,
}) => {
  // Функція для обробки чисел у назві
  const highlightUnits = text => {
    return text.replace(/(\d+\s*(г|мл))/gi, '<span class="number">$1</span>');
  };

  return data.map(e => (
    <div>
      <div
        key={e._id}
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
      </div>
    </div>
  ));
};
