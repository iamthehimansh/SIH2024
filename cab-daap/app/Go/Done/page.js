"use client";
import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import './RideCompletePage.css'; // You'll need to create this CSS file

const RideCompletePage = () => {
  return (
    <div className="ride-complete-app">
      <div className="info-bar">
        <div className="complete-text">Ride Complete</div>
        <div className="fare-tag">₹250</div>
      </div>

      <div className="trip-summary">
        <h2>Trip Summary</h2>
        <div className="trip-details">
          <div className="detail-item">
            <span>Distance</span>
            <span>15.2 km</span>
          </div>
          <div className="detail-item">
            <span>Duration</span>
            <span>32 min</span>
          </div>
        </div>
      </div>

      <div className="driver-info">
        <div className="driver-details">
          <div className="driver-avatar">
            <img src="/land-removebg-preview.png" alt="Driver" />
          </div>
          <div className="driver-meta">
            <div className="driver-name">Parth</div>
            <div className="vehicle-info">DL1ZC8220 • Volkswagen Jetta</div>
          </div>
        </div>
        <div className="rating-section">
          <h3>Rate your trip</h3>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="star" />
            ))}
          </div>
        </div>
        <textarea className="feedback-input" placeholder="Leave a comment (optional)" />
        <div className="action-buttons">
          <button className="submit-rating-button">
            Submit Rating
          </button>
          <button className="support-button">
            <MessageSquare className="icon" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideCompletePage;
