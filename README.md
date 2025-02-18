    <h1>🌍 Catch Up</h1>
    
    <p>Catch Up is a location-based social discovery application that helps users find nearby places and see where their friends are hanging out in real-time.</p>

    <h2>Features</h2>
    <ul>
        <li>Location-based place discovery</li>
        <li>Interactive map with place markers</li>
        <li>Real-time friend check-ins</li>
        <li>Personalized place recommendations</li>
        <li>Detailed place information including ratings and distance</li>
        <li>Integration with Foursquare API for accurate place data</li>
        <li>AI-powered recommendations using Google's Gemini API</li>
    </ul>

    <h2>Tech Stack</h2>
    <ul>
        <li>React.js - Frontend framework</li>
        <li>React Leaflet - Map integration</li>
        <li>Foursquare API - Places data</li>
        <li>Google Gemini API - AI recommendations</li>
        <li>Wikimedia API - Place images</li>
        <li>Haversine formula - Distance calculations</li>
    </ul>

    <h2>Prerequisites</h2>
    <ul>
        <li>Node.js (v14 or higher)</li>
        <li>NPM or Yarn package manager</li>
        <li>Foursquare API key</li>
        <li>Google Gemini API key</li>
    </ul>

    <h2>Installation</h2>
    <ol>
        <li>Clone the repository:
            <pre>git clone https://github.com/yourusername/catch-up.git</pre>
        </li>
        <li>Navigate to the project directory:
            <pre>cd catch-up</pre>
        </li>
        <li>Install dependencies:
            <pre>npm install</pre>
        </li>
        <li>Create a .env file in the root directory and add your API keys:
            <pre>
REACT_APP_FOURSQUARE_API_KEY=your_foursquare_key
REACT_APP_GEMINI_API_KEY=your_gemini_key
            </pre>
        </li>
        <li>Start the development server:
            <pre>npm start</pre>
        </li>
    </ol>

    <h2>User Guide</h2>
    <h3>Getting Started</h3>
    <ol>
        <li>Enter a location in the search bar at the top of the page</li>
        <li>Click "Explore" to see nearby places</li>
        <li>The map will center on your chosen location and display markers for nearby places</li>
        <li>Scroll through the place cards below the map to see detailed information</li>
    </ol>

    <h3>Exploring Places</h3>
    <ol>
        <li>Click on any card or map marker to view detailed information about a place</li>
        <li>View basic information like:
            <ul>
                <li>Place name and category</li>
                <li>Rating and distance</li>
                <li>Address and contact information</li>
                <li>Operating hours</li>
            </ul>
        </li>
        <li>See which friends are currently checked in at each location</li>
        <li>Get personalized recommendations by clicking "Get Personalized Recommendation"</li>
    </ol>

    <h3>Getting Personalized Recommendations</h3>
    <ol>
        <li>Click "Get Personalized Recommendation" on any place's detail view</li>
        <li>Answer questions about your preferences:
            <ul>
                <li>Preferred cuisine type</li>
                <li>Desired atmosphere</li>
                <li>Price range</li>
            </ul>
        </li>
        <li>Receive AI-powered recommendations based on your preferences</li>
    </ol>

    <h2>API Integration</h2>
    <h3>Foursquare API</h3>
    <p>Used for fetching nearby places with the following information:</p>
    <ul>
        <li>Place names and categories</li>
        <li>Locations and coordinates</li>
        <li>Ratings and reviews</li>
        <li>Contact information and operating hours</li>
    </ul>

    <h3>Google Gemini API</h3>
    <p>Provides personalized place recommendations based on:</p>
    <ul>
        <li>User preferences</li>
        <li>Place characteristics</li>
        <li>Historical user behavior</li>
    </ul>

    <h2>Contributing</h2>
    <ol>
        <li>Fork the repository</li>
        <li>Create a new branch:
            <pre>git checkout -b feature/your-feature-name</pre>
        </li>
        <li>Make your changes and commit them:
            <pre>git commit -m 'Add some feature'</pre>
        </li>
        <li>Push to the branch:
            <pre>git push origin feature/your-feature-name</pre>
        </li>
        <li>Submit a pull request</li>
    </ol>

    <h2>License</h2>
    <p>This project is licensed under the MIT License - see the LICENSE.md file for details</p>

    <h2>Acknowledgments</h2>
    <ul>
        <li>Foursquare API for place data</li>
        <li>Google Gemini for AI recommendations</li>
        <li>Wikimedia Commons for place images</li>
        <li>OpenStreetMap contributors for map data</li>
    </ul>
