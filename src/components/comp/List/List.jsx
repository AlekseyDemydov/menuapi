import s from './List.module.scss';
import config from 'config';
import oops from './img/oops.webp';

export const List = ({ data, onModal, subcategory, category }) => {
  // Функція для обробки чисел у назві
  const highlightUnits = (text) => {
    return text.replace(/(\d+\s*(г|мл))/gi, '<span class="number">$1</span>');
  };

  return data.map(e => (
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
      {console.log(e.src)}
      <div className={s.itemBox}>
        <div className={s.itemMain}>
          <h3
            className={`${s.title} ${subcategory === 'Пиво' ? s.beer : ''}`}
            dangerouslySetInnerHTML={{ __html: highlightUnits(e.title) }}
          />
          {e.isNew && <span className={s.newWord}>NEW</span>}
          <div className={s.boxPrice}>
            <h3
              className={`${s.price} ${subcategory === 'Пиво' ? s.widthPrice : ''}`}
            >
              {e.price}
            </h3>
            {e.price2 && (
              <h3
                className={`${s.price} ${subcategory === 'Пиво' ? s.widthPrice : ''}`}
              >
                {e.price2}
              </h3>
            )}
          </div>
        </div>

        <p className={s.text}>{e.text}</p>
      </div>
    </div>
  ));
};
