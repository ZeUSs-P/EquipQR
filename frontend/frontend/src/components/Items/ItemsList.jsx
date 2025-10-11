import React, { useState, useEffect } from 'react';
import { ItemCard } from './ItemCard';
import { SearchBar } from './SearchBar';
import { apiService } from '../../services/api';

export const ItemsList = ({ cart, onAddToCart, onViewCart }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await apiService.getItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        cartCount={cart.length}
        onViewCart={onViewCart}
      />

      <div className="items-grid">
        {filteredItems.map(item => (
          <ItemCard
            key={item._id}
            item={item}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};