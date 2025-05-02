import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import config from 'config';
import s from './Admin.module.scss';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    price2: '',
    src: '',
    text: '',
    description: '',
    zvd: '',
    isNew: false,
    categoryId: '',
    subcategoryId: '',
    category: '',
    subcategory: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${config.baseURL}/api/products`);

        // Логування отриманих даних
        console.log('Отримані дані з API:', data);

        const allProducts = data.flatMap(category =>
          (category.subcategories || []).flatMap(subcategory =>
            (subcategory.items || []).map(item => ({
              ...item,
              category: category.category,
              categoryId: category._id,
              subcategory: subcategory.subcategory,
              subcategoryId: subcategory._id,
            }))
          )
        );

        // Логування змін після мапінгу даних
        console.log('Оброблені продукти:', allProducts);

        setProducts(allProducts);
        setCategories(data);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
        alert('Не вдалося завантажити продукти.');
      }
    };

    fetchData();
  }, []);

  const openModal = (product = null) => {
    if (product) {
      setFormData({
        ...product,
        isNew: Boolean(product.isNew),
      });
    } else {
      setFormData({
        title: '',
        price: '',
        price2: '',
        src: '',
        text: '',
        description: '',
        zvd: '',
        isNew: false,
        categoryId: '',
        subcategoryId: '',
        category: '',
        subcategory: '',
      });
    }
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditProduct(null);
    setIsModalOpen(false);
  };

  const handleChange = e => {
    const { name, type, checked, value } = e.target;
    console.log(`Updating ${name}:`, type === 'checkbox' ? checked : value); // Логування
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const { categoryId, subcategoryId, _id, ...restData } = formData;

      const payload = {
        ...restData,
        categoryId,
        subcategoryId,
      };

      if (editProduct) {
        await axios.put(
          `${config.baseURL}/api/products/category/${editProduct.categoryId}/subcategory/${editProduct.subcategoryId}/product/${_id}`,
          payload
        );
      } else {
        await axios.post(
          `${config.baseURL}/api/products/category/${categoryId}/subcategory/${subcategoryId}/product`,
          payload
        );
      }

      window.location.reload();
    } catch (err) {
      console.error('Помилка при збереженні продукту', err);
    }
  };

  const inputFileRef = useRef(null);

  const handleChangeFile = async event => {
    try {
      const file = event.target.files[0];
      const form = new FormData();
      form.append('image', file);

      const { data } = await axios.post(`${config.baseURL}/upload`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData(prev => ({
        ...prev,
        src: data.url, // Зберігаємо посилання у src
      }));
    } catch (err) {
      console.warn(err);
      alert('Помилка при завантаженні зображення');
    }
  };

  const addCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const { data } = await axios.post(
          `${config.baseURL}/api/products/category`,
          {
            category: newCategoryName.trim(),
            subcategories: [],
          }
        );
        setCategories(prev => [...prev, data]);
        setFormData(prev => ({ ...prev, categoryId: data._id }));
        setShowNewCategoryInput(false);
        setNewCategoryName('');
      } catch (err) {
        console.error('Помилка при додаванні категорії', err);
      }
    }
  };

  const addSubcategory = async () => {
    if (newSubcategoryName.trim() && formData.categoryId) {
      try {
        const response = await axios.post(
          `${config.baseURL}/api/products/category/${formData.categoryId}/subcategory`,
          {
            subcategory: newSubcategoryName.trim(),
          }
        );

        const data = response.data;

        // Якщо бекенд не повертає назву підкатегорії — додаємо вручну
        const newSub = {
          _id: data._id,
          subcategory: data.subcategory || newSubcategoryName.trim(),
        };

        const updatedCategories = categories.map(cat =>
          cat._id === formData.categoryId
            ? { ...cat, subcategories: [...cat.subcategories, newSub] }
            : cat
        );

        setCategories(updatedCategories);
        setFormData(prev => ({ ...prev, subcategoryId: newSub._id }));
        setShowNewSubcategoryInput(false);
        setNewSubcategoryName('');
      } catch (err) {
        console.error('Помилка при додаванні підкатегорії', err);
      }
    }
  };

  // Функція для видалення продукту
  const handleDelete = async product => {
    try {
      await axios.delete(
        `${config.baseURL}/api/products/category/${product.categoryId}/subcategory/${product.subcategoryId}/product/${product._id}`
      );
      setProducts(prev => prev.filter(p => p._id !== product._id));
    } catch (err) {
      console.error('Помилка при видаленні продукту', err);
      alert('Не вдалося видалити продукт.');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={s.adminWrapper}>
      <div className={s.controlBar}>
        <button onClick={() => openModal()} className={s.createButton}>
          Створити продукт
        </button>

        <input
          type="text"
          placeholder="Пошук за назвою"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className={s.searchInput}
        />

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className={s.categoryFilter}
        >
          <option value="">Усі категорії</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.category}
            </option>
          ))}
        </select>
      </div>

      <table className={s.productTable}>
        <thead>
          <tr>
            <th>Фото</th>
            <th>Назва</th>
            <th>Ціна</th>
            <th>Ціна 2</th>
            <th>Категорія</th>
            <th>Підкатегорія</th>
            <th>Текст</th>
            <th>Опис</th>
            <th>ЗВД</th>
            <th>Новий</th>
            <th>Редагувати</th>
            <th>Видалити</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product._id}>
              <td>
                <img
                  src={`${config.baseURL}${product.src}`}
                  alt={product.title}
                  className={s.tableImage}
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              </td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.price2}</td>
              <td>{product.category}</td>
              <td>{product.subcategory}</td>
              <td>{product.text}</td>
              <td>{product.description}</td>
              <td>{product.zvd}</td>
              <td>{product.isNew ? 'Так' : 'Ні'}</td>
              <td>
                <button onClick={() => openModal(product)}>Редагувати</button>
              </td>
              <td>
                <button onClick={() => handleDelete(product)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className={s.modalOverlay}>
          <div className={s.modalContent}>
            <button onClick={closeModal} className={s.closeButton}>
              ×
            </button>
            <form onSubmit={handleSubmit} className={s.modalForm}>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={e => {
                  if (e.target.value === 'new') {
                    setShowNewCategoryInput(true);
                    setFormData(prev => ({ ...prev, categoryId: '' }));
                  } else {
                    setShowNewCategoryInput(false);
                    handleChange(e);
                  }
                }}
                required
              >
                <option value="">Оберіть категорію</option>
                {categories.map(c => (
                  <option value={c._id} key={c._id}>
                    {c.category}
                  </option>
                ))}
                <option value="new">+ Створити нову категорію</option>
              </select>

              {showNewCategoryInput && (
                <div className={s.inlineCreate}>
                  <input
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="Назва нової категорії"
                  />
                  <button type="button" onClick={addCategory}>
                    Додати
                  </button>
                </div>
              )}

              {formData.categoryId && (
                <>
                  <select
                    name="subcategoryId"
                    value={formData.subcategoryId}
                    onChange={e => {
                      if (e.target.value === 'new') {
                        setShowNewSubcategoryInput(true);
                        setFormData(prev => ({ ...prev, subcategoryId: '' }));
                      } else {
                        setShowNewSubcategoryInput(false);
                        handleChange(e);
                      }
                    }}
                    required
                  >
                    <option value="">Оберіть підкатегорію</option>
                    {categories
                      .find(c => c._id === formData.categoryId)
                      ?.subcategories.map(s => (
                        <option value={s._id} key={s._id}>
                          {s.subcategory}
                        </option>
                      ))}
                    <option value="new">+ Створити нову підкатегорію</option>
                  </select>

                  {showNewSubcategoryInput && (
                    <div className={s.inlineCreate}>
                      <input
                        value={newSubcategoryName}
                        onChange={e => setNewSubcategoryName(e.target.value)}
                        placeholder="Назва нової підкатегорії"
                      />
                      <button type="button" onClick={addSubcategory}>
                        Додати
                      </button>
                    </div>
                  )}
                </>
              )}
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Назва"
                required
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ціна"
                required
              />
              <input
                name="price2"
                value={formData.price2}
                onChange={handleChange}
                placeholder="Ціна 2"
              />
              <label style={{ display: 'none' }}>
                <input
                  name="src"
                  value={formData.src}
                  onChange={handleChange}
                  placeholder="URL зображення"
                />
              </label>

              <input
                ref={inputFileRef}
                type="file"
                onChange={handleChangeFile}
                hidden
              />

              <button
                type="button"
                onClick={() => inputFileRef.current.click()}
              >
                Завантажити зображення
              </button>

              {formData.src && (
                <img
                  src={`${config.baseURL}${formData.src}`}
                  alt="Прев’ю"
                  style={{ width: '100px', marginTop: '10px' }}
                  crossOrigin="anonymous"
                  loading="lazy"
                />
              )}

              <input
                name="text"
                value={formData.text}
                onChange={handleChange}
                placeholder="Текст"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Опис"
              />
              <input
                name="zvd"
                value={formData.zvd}
                onChange={handleChange}
                placeholder="ЗВД"
              />
              <label>
                Новий продукт
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Зберегти</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
