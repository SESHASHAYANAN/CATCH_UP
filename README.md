# 🌍 Catch Up

A location-based social discovery application that helps users find nearby places and see where their friends are hanging out in real-time.

## ✨ Features

- 🗺️ Location-based place discovery with interactive map
- 👥 Real-time friend check-ins and social features
- 🎯 Personalized place recommendations using AI
- ⭐ Detailed place information with ratings and distance
- 📍 Integration with Foursquare API for accurate place data
- 🤖 AI-powered recommendations using Google's Gemini API
- 🖼️ Place images from Wikimedia Commons

## 🚀 Tech Stack

- React.js
- React Leaflet
- Foursquare Places API
- Google Gemini API
- Wikimedia API
- Haversine formula for distance calculations

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- NPM or Yarn package manager
- Foursquare API key
- Google Gemini API key

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/catch-up.git
```

2. Navigate to the project directory:
```bash
cd catch-up
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and add your API keys:
```env
REACT_APP_FOURSQUARE_API_KEY=your_foursquare_key
REACT_APP_GEMINI_API_KEY=your_gemini_key
```

5. Start the development server:
```bash
npm start
```

## 📱 Usage

### Basic Navigation
1. Enter any location in the search bar
2. Click "Explore" to discover nearby places
3. View places on the interactive map and in the card list below
4. Click on markers or cards to view detailed information

### Place Details
- View basic information (name, category, rating, distance)
- See address and contact details
- Check operating hours
- View friends currently at the location
- Get AI-powered personalized recommendations

### Personalized Recommendations
1. Click "Get Personalized Recommendation" on any place
2. Answer preference questions about:
   - Cuisine type
   - Atmosphere
   - Price range
3. Receive tailored recommendations based on your preferences

## 🔌 API Integration

### Foursquare API
Used to fetch nearby places with:
- Place names and categories
- Locations and coordinates
- Ratings and reviews
- Contact information
- Operating hours

### Google Gemini API
Provides personalized recommendations based on:
- User preferences
- Place characteristics
- Historical behavior

## 📦 Project Structure

```
src/
  ├── App.js              # Main application component
  ├── styles.css          # Application styles
  ├── components/         # React components
  ├── services/          # API integration services
  ├── utils/             # Helper functions
  └── assets/            # Static assets
```

## 🔧 Configuration

The application uses the following environment variables:

```env
REACT_APP_FOURSQUARE_API_KEY - Foursquare Places API key
REACT_APP_GEMINI_API_KEY - Google Gemini API key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes:
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the branch:
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👏 Acknowledgments

- Foursquare API for place data
- Google Gemini for AI recommendations
- Wikimedia Commons for place images
- OpenStreetMap contributors for map data

## 🐛 Known Issues

- Image loading may be slow in areas with limited Wikimedia Commons coverage
- Friend check-in data is currently mocked for demonstration purposes

## 🔮 Future Enhancements

- Real-time friend location updates
- User authentication and profiles
- Favorite places and personalized lists
- Social sharing features
- Advanced filtering options
- Mobile app version

## 📞 Support

For support, email support@catchup.com or join our Slack channel.

