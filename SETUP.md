# EV Charging Station App - Setup Guide

This is a comprehensive guide to set up and run the EV Charging Station Finder App.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android emulator) or Xcode (for iOS simulator)
- Firebase account
- Google Cloud account with Maps and Places API enabled

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
4. Enable Firestore:
   - Go to Firestore Database
   - Create database in test mode (or production with proper rules)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Add a new app or use existing
   - Copy the config object

6. Update `config/firebase.ts` with your Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Google Maps & Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
4. Create API keys:
   - Go to APIs & Services > Credentials
   - Create credentials > API Key
   - Create separate keys for Android and iOS (recommended)
   - Restrict keys to specific APIs for security

5. Update `app.json` with your API keys:

```json
{
  "ios": {
    "config": {
      "googleMapsApiKey": "YOUR_IOS_GOOGLE_MAPS_API_KEY"
    }
  },
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_ANDROID_GOOGLE_MAPS_API_KEY"
      }
    }
  }
}
```

6. Update `components/SearchBar.tsx`:
   - Replace `YOUR_GOOGLE_PLACES_API_KEY` with your actual API key

7. Update `services/evStations.ts`:
   - Replace `YOUR_GOOGLE_PLACES_API_KEY` with your actual API key

### 4. Custom Fonts (Optional)

1. Download your preferred fonts (e.g., from Google Fonts)
2. Place font files in `assets/fonts/` directory
3. Update `app/_layout.tsx` to load your fonts:

```typescript
const [loaded, error] = useFonts({
  'YourFont-Regular': require('../assets/fonts/YourFont-Regular.ttf'),
  'YourFont-Bold': require('../assets/fonts/YourFont-Bold.ttf'),
});
```

### 5. Run the App

#### For Android Emulator:
```bash
npm run android
```

#### For iOS Simulator (Mac only):
```bash
npm run ios
```

#### For Development:
```bash
npm start
```
Then press `a` for Android or `i` for iOS.

### 6. Firestore Security Rules

Update your Firestore rules to allow users to read/write their own favorites:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features Implemented

✅ **Authentication**
- Email/Password login and registration
- Firebase Authentication integration
- Protected routes

✅ **Google Maps Integration**
- Custom styled map view
- User location tracking
- Location markers
- EV station markers

✅ **Location Services**
- Get current user location
- Request location permissions
- Display user location on map

✅ **Search Functionality**
- Search for locations
- Google Places integration (needs API key)
- Find EV stations by address

✅ **EV Station Features**
- Display nearby EV stations
- Station details (name, address, rating, price)
- Availability status
- Connector types
- Distance calculation

✅ **Favorites**
- Add/remove stations to favorites
- Favorites tab screen
- Firebase Firestore integration
- AsyncStorage fallback

✅ **UI Components**
- Custom header
- Search bar
- Station list with cards
- Tab navigation

## What You Need to Change/Add

### Required Changes:

1. **Firebase Configuration** (`config/firebase.ts`)
   - Add your Firebase project credentials

2. **Google Maps API Keys** (`app.json`)
   - Add iOS and Android API keys

3. **Google Places API Key** (`components/SearchBar.tsx` and `services/evStations.ts`)
   - Replace placeholder with actual API key

### Optional Enhancements:

1. **Real EV Station Data**
   - Integrate with Open Charge Map API
   - Or use Google Places API to search for "EV charging station"
   - Update `services/evStations.ts` with real API calls

2. **Station Details Screen**
   - Create a detailed view for each station
   - Show directions, reviews, photos
   - Add navigation integration

3. **Filters**
   - Filter by connector type
   - Filter by availability
   - Filter by price range
   - Filter by distance

4. **User Profile**
   - Add user profile screen
   - Save preferred settings
   - Payment methods (if applicable)

5. **Notifications**
   - Push notifications for nearby stations
   - Favorite station availability alerts

6. **Offline Support**
   - Cache station data
   - Offline map tiles
   - Sync when online

## Troubleshooting

### Maps not showing:
- Verify API keys are correct
- Check API restrictions in Google Cloud Console
- Ensure billing is enabled for Google Cloud project

### Location not working:
- Check app permissions in device settings
- Verify location permissions in `app.json`
- Test on real device if emulator issues persist

### Firebase errors:
- Verify Firebase config is correct
- Check Firestore rules
- Ensure Authentication is enabled

### Build errors:
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall
- Check Expo SDK version compatibility

## Project Structure

```
EV-Charging-Station-App/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen with map
│   │   ├── favorites.tsx      # Favorites screen
│   │   └── _layout.tsx        # Tab navigation
│   ├── login.tsx              # Login/Register screen
│   └── _layout.tsx            # Root layout
├── components/
│   ├── Header.tsx             # App header
│   ├── SearchBar.tsx          # Location search
│   └── StationList.tsx        # Station list component
├── config/
│   └── firebase.ts            # Firebase configuration
├── contexts/
│   ├── AuthContext.tsx        # Authentication context
│   └── FavoritesContext.tsx   # Favorites context
├── services/
│   └── evStations.ts          # EV station service
├── types/
│   └── index.ts               # TypeScript types
└── assets/
    └── fonts/                 # Custom fonts
```

## Next Steps

1. Complete the setup steps above
2. Test authentication flow
3. Test map and location features
4. Integrate real EV station data API
5. Add additional features as needed
6. Test on real devices
7. Deploy to app stores

## Support

For issues or questions:
- Check Expo documentation: https://docs.expo.dev/
- Check React Native Maps: https://github.com/react-native-maps/react-native-maps
- Check Firebase docs: https://firebase.google.com/docs












