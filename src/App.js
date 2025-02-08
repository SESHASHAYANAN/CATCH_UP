import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import haversine from "haversine";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const FOURSQUARE_API_KEY = "fsq3SCwDfGIYcJRjgSOVrmZrxc0Q/Kwd0myvQBTsCS3w4Fw=";
const GEMINI_API_KEY = "AIzaSyAEXITDDzX4yOoHl4tOuFEaxkqtniph1NY";

// Mock friends data
const MOCK_FRIENDS = {
  Restaurant: [
    { name: "Alice", checkIn: "2 hours ago", avatar: "👩" },
    { name: "Bob", checkIn: "1 hour ago", avatar: "👨" },
  ],
  Cafe: [{ name: "Charlie", checkIn: "30 minutes ago", avatar: "👨" }],
  Bar: [
    { name: "Diana", checkIn: "15 minutes ago", avatar: "👩" },
    { name: "Eve", checkIn: "45 minutes ago", avatar: "👩" },
  ],
};

// Questions for user preferences
const PREFERENCE_QUESTIONS = [
  {
    id: "cuisine",
    question: "What type of cuisine do you prefer?",
    options: ["Indian", "Italian", "Chinese", "American", "Any"],
  },
  {
    id: "atmosphere",
    question: "What atmosphere are you looking for?",
    options: ["Casual", "Fine Dining", "Outdoor", "Cozy", "Any"],
  },
  {
    id: "price",
    question: "What's your preferred price range?",
    options: ["$", "$$", "$$$", "$$$$", "Any"],
  },
];

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

async function fetchNearbyPlaces(lat, lon) {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?ll=${lat},${lon}&radius=7000&limit=6&sort=RATING`,
      {
        headers: {
          Authorization: FOURSQUARE_API_KEY,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    return data.results.map((place) => ({
      category: place.categories[0]?.name || "Place",
      name: place.name,
      description: `${place.location.address || ""} ${
        place.location.locality || ""
      }`,
      emoji: getCategoryEmoji(place.categories[0]?.name),
      coords: {
        lat: place.geocodes.main.latitude,
        lng: place.geocodes.main.longitude,
      },
      rating: place.rating ? place.rating / 2 : 4,
      details: {
        address: place.location.formatted_address,
        phone: place.tel,
        website: place.website,
        hours: place.hours?.display,
        isOpen: place.hours?.is_open,
        stats: {
          totalRatings: place.stats?.total_ratings,
          popularity: place.popularity,
        },
      },
    }));
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

function getCategoryEmoji(category = "") {
  const categoryMap = {
    Restaurant: "🍽️",
    Hotel: "🏨",
    Bar: "🍸",
    "Coffee Shop": "☕",
    Park: "🌳",
    Museum: "🏛️",
    "Shopping Mall": "🛍️",
    Gym: "💪",
    Library: "📚",
    "Movie Theater": "🎬",
  };

  const lowercaseCategory = category.toLowerCase();
  for (const [key, emoji] of Object.entries(categoryMap)) {
    if (lowercaseCategory.includes(key.toLowerCase())) {
      return emoji;
    }
  }
  return "📍";
}

const CustomPopup = ({ place, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [preferences, setPreferences] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Function to handle user preference selection
  const handlePreferenceSelect = async (answer) => {
    const newPreferences = {
      ...preferences,
      [PREFERENCE_QUESTIONS[currentQuestion].id]: answer,
    };
    setPreferences(newPreferences);

    if (currentQuestion < PREFERENCE_QUESTIONS.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
    } else {
      // Get recommendation from Gemini
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Based on these preferences:
                    - Cuisine: ${newPreferences.cuisine}
                    - Atmosphere: ${newPreferences.atmosphere}
                    - Price Range: ${newPreferences.price}
                    
                    Give a personalized recommendation for ${place.name} (${place.category}).
                    Include why it might be a good match and suggest specific dishes or experiences.
                    Keep it under 100 words.`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        setRecommendation(data.candidates[0].content.parts[0].text);
      } catch (error) {
        console.error("Error getting recommendation:", error);
        setRecommendation("Unable to generate recommendation at this time.");
      }

      setShowQuestions(false);
    }
  };

  // Get friends who are at this place
  const getFriendsAtPlace = () => {
    return MOCK_FRIENDS[place.category] || [];
  };

  const renderContent = () => {
    if (showQuestions) {
      const currentQ = PREFERENCE_QUESTIONS[currentQuestion];
      return (
        <div className="questions-container">
          <h3>Help us personalize your recommendation</h3>
          <p>{currentQ.question}</p>
          <div className="options-grid">
            {currentQ.options.map((option) => (
              <button
                key={option}
                className="option-button"
                onClick={() => handlePreferenceSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="popup-content">
        <h3>{place.emoji} Place Details</h3>
        <div className="place-info">
          <p>
            <strong>Address:</strong> {place.details.address}
          </p>
          {place.details.phone && (
            <p>
              <strong>Phone:</strong> {place.details.phone}
            </p>
          )}
          {place.details.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={place.details.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Website
              </a>
            </p>
          )}
          {place.details.hours && (
            <p>
              <strong>Hours:</strong> {place.details.hours}
            </p>
          )}

          {/* Friends section */}
          <div className="friends-section">
            <h4>Friends Here Now</h4>
            <div className="friends-list">
              {getFriendsAtPlace().map((friend, idx) => (
                <div key={idx} className="friend-item">
                  <span className="friend-avatar">{friend.avatar}</span>
                  <span className="friend-name">{friend.name}</span>
                  <span className="check-in-time">{friend.checkIn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation section */}
          {recommendation ? (
            <div className="recommendation-section">
              <h4>Personalized Recommendation</h4>
              <p>{recommendation}</p>
            </div>
          ) : (
            <button
              className="get-recommendation-btn"
              onClick={() => setShowQuestions(true)}
            >
              Get Personalized Recommendation
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`custom-popup ${isVisible ? "visible" : ""}`}>
      <div className="popup-header">
        <h2>{place.name}</h2>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

async function fetchLocationImage(lat, lon) {
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&format=json&list=geosearch&gsradius=1000&gslimit=1&gscoord=${lat}|${lon}&origin=*`
    );
    const data = await response.json();

    if (data.query?.geosearch?.length > 0) {
      const pageId = data.query.geosearch[0].pageid;
      const imageResponse = await fetch(
        `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&pageids=${pageId}&format=json&origin=*`
      );
      const imageData = await imageResponse.json();
      return imageData.query.pages[pageId].imageinfo[0].url;
    }
  } catch (error) {
    console.error("Image fetch error:", error);
  }
  return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png";
}

function App() {
  const [location, setLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState([51.505, -0.09]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const mapRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSelectedPlace(null);
    setShowPopup(false);

    try {
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const nominatimData = await nominatimResponse.json();

      if (!nominatimData.length) {
        alert("Location not found!");
        return;
      }

      const { lat, lon } = nominatimData[0];
      const baseCoords = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
      setCenter([baseCoords.latitude, baseCoords.longitude]);

      // Fetch real places from Foursquare
      const places = await fetchNearbyPlaces(lat, lon);

      const withImages = await Promise.all(
        places.map(async (item) => {
          const image = await fetchLocationImage(
            item.coords.lat,
            item.coords.lng
          );
          return {
            ...item,
            image,
            distance: haversine(
              baseCoords,
              { latitude: item.coords.lat, longitude: item.coords.lng },
              { unit: "km" }
            ),
          };
        })
      );

      setRecommendations(withImages);
    } catch (error) {
      console.error(error);
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    setSelectedPlace(index);
    setShowPopup(true);
    const place = recommendations[index];
    if (place && mapRef.current) {
      mapRef.current.flyTo([place.coords.lat, place.coords.lng], 15);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🌍 CATCH UP</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter a location..."
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Explore"}
          </button>
        </form>
      </header>

      <div className="map-container">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapCenter center={center} />

          {recommendations.map((place, index) => (
            <Marker
              key={index}
              position={[place.coords.lat, place.coords.lng]}
              eventHandlers={{
                click: () => handleCardClick(index),
              }}
            >
              <Popup>
                <h3>
                  {place.emoji} {place.name}
                </h3>
                <p>Category: {place.category}</p>
                <p>Rating: ⭐{place.rating}/5</p>
                <p>Distance: {place.distance.toFixed(1)} km</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="recommendations">
        {recommendations.map((item, index) => (
          <div
            key={index}
            className={`card ${selectedPlace === index ? "selected" : ""}`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-image">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src =
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png";
                }}
              />
              <div className="image-attribution">
                Photos from Wikimedia Commons
              </div>
            </div>
            <div className="card-content">
              <div className="card-header">
                <span className="emoji">{item.emoji}</span>
                <div>
                  <h3>{item.name}</h3>
                  <div className="meta">
                    <span className={`category ${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                    <span className="rating">⭐{item.rating}/5</span>
                    <span className="distance">
                      📏 {item.distance.toFixed(1)}km
                    </span>
                  </div>
                </div>
              </div>
              <p className="description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showPopup && selectedPlace !== null && (
        <CustomPopup
          place={recommendations[selectedPlace]}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

// Add required CSS styles
const styles = `
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 20px;
}

header form {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

header input {
  padding: 8px 12px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

header button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

header button:disabled {
  background: #ccc;
}

.map-container {
  height: 400px;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.recommendations {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  background: white;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card.selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px #007bff;
}

.card-image {
  position: relative;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-attribution {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  font-size: 0.8rem;
}

.card-content {
  padding: 15px;
}

.card-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.emoji {
  font-size: 1.5rem;
}

.meta {
  display: flex;
  gap: 10px;
  margin-top: 5px;
  font-size: 0.9rem;
}

.category {
  padding: 2px 6px;
  border-radius: 4px;
  background: #f0f0f0;
}

.description {
  color: #666;
  font-size: 0.9rem;
}

.custom-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-popup.visible {
  opacity: 1;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 5px;
}

.friends-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.friend-avatar {
  font-size: 1.5rem;
}

.friend-name {
  font-weight: 500;
}

.check-in-time {
  color: #666;
  font-size: 0.9rem;
  margin-left: auto;
}

.questions-container {
  padding: 1rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.option-button {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.option-button:hover {
  background: #f0f0f0;
}

.get-recommendation-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.recommendation-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}
`;

export default App;
