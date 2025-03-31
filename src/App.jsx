import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles.css";

// Main App Component
export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const mockRestaurants = [
      {
        id: 1,
        name: "Pasta Palace",
        rating: 4.5,
        cuisine: "Italian",
        location: "Makarba, Ahmedabad",
        closesAt: "24:00", // 10 PM
        image: "https://picsum.photos/400/250?random=1",
      },
      {
        id: 2,
        name: "Sushi Haven",
        rating: 4.8,
        cuisine: "Japanese",
        location: "Satellite, Ahmedabad",
        closesAt: "24:00", // 11 PM
        image: "https://picsum.photos/400/250?random=2",
      },
      {
        id: 3,
        name: "Burger Bonanza",
        rating: 4.3,
        cuisine: "American",
        location: "Old high court, Ahmedabad",
        closesAt: "24:00", // 9:30 PM
        image: "https://picsum.photos/400/250?random=3",
      },
    ];
    setRestaurants(mockRestaurants);
  }, []);

  function getClosingTime(closesAt) {
    const now = new Date();
    const closeTime = new Date();
    const [hours, minutes] = closesAt.split(":").map(Number);
    closeTime.setHours(hours, minutes, 0, 0);

    let diff = (closeTime - now) / (1000 * 60);
    if (diff <= 0) return "Closed";

    let hoursLeft = Math.floor(diff / 60);
    let minsLeft = Math.floor(diff % 60);
    return hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft}m`;
  }

  function getAvailableTimeSlots(closesAt) {
    const slots = [];
    const now = new Date();
    let startTime = new Date();
    startTime.setMinutes(Math.ceil(now.getMinutes() / 30) * 30, 0, 0); // Start from next 30 min slot
    let closeTime = new Date();
    const [closeHour, closeMinute] = closesAt.split(":").map(Number);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    while (startTime < closeTime) {
      slots.push(
        startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      startTime.setMinutes(startTime.getMinutes() + 30);
    }

    return slots.length > 0 ? slots : ["No available slots"];
  }

  function handleBooking(restaurant) {
    setSelectedRestaurant(restaurant);
    setIsBooking(true);
    setSelectedTime(null);
  }

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Restaurant Reservations</h1>
          <p>Book your perfect dining experience</p>
        </header>

        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <div className="restaurant-section">
                  <h2>Choose a Restaurant</h2>
                  <div className="restaurant-grid">
                    {restaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        className={`restaurant-card ${
                          selectedRestaurant?.id === restaurant.id
                            ? "selected"
                            : ""
                        }`}
                      >
                        <div onClick={() => handleBooking(restaurant)}>
                          <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="restaurant-image"
                          />
                          <div className="restaurant-info">
                            <div className="restaurant-header">
                              <h3>{restaurant.name}</h3>
                              <span className="rating">⭐ {restaurant.rating}</span>
                            </div>
                            <p className="cuisine">🍽️ {restaurant.cuisine}</p>
                            <p className="location">📍 {restaurant.location}</p>
                            <p className="closing-time">
                              ⏳ Closes in {getClosingTime(restaurant.closesAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {isBooking && selectedRestaurant && (
                    <div className="booking-form">
                      <h3>Book a Table at {selectedRestaurant.name}</h3>
                      <form>
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input type="text" id="name" required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="date">Date</label>
                          <input type="date" id="date" required />
                        </div>
                        <div className="form-group">
                          <label>Pick a Time</label>
                          <div className="time-slot-container">
                            {getAvailableTimeSlots(selectedRestaurant.closesAt).map(
                              (slot, index) => (
                                <div
                                  key={index}
                                  className={`time-slot ${
                                    selectedTime === slot ? "selected-time" : ""
                                  }`}
                                  onClick={() => setSelectedTime(slot)}
                                >
                                  {slot}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="guests">Number of Guests</label>
                          <input type="number" id="guests" min="1" required />
                        </div>
                        <button type="submit">Book Table</button>
                      </form>
                    </div>
                  )}
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
