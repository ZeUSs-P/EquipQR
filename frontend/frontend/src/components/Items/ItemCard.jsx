import React from 'react';
import { Package } from 'lucide-react';

export const ItemCard = ({ item, onAddToCart }) => {
  return (
    <div className="item-card">
      <div className="item-header">
        <div className="item-info">
          <h3>{item.name}</h3>
          {item.category && (
            <span className="item-category">{item.category}</span>
          )}
        </div>
        <div className="item-icon">
          <Package size={28} />
        </div>
      </div>
      
      <div className="item-details">
        <div className="item-detail-row">
          <span className="detail-label">Total Quantity</span>
          <span className="detail-value">{item.quantity}</span>
        </div>
        <div className="item-detail-row">
          <span className="detail-label">Available</span>
          <span className={`detail-value ${item.available > 0 ? 'available' : 'unavailable'}`}>
            {item.available}
          </span>
        </div>
      </div>

      <button
        onClick={() => onAddToCart(item)}
        disabled={item.available === 0}
        className="btn-add-cart"
      >
        {item.available > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};