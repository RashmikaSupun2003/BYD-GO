# EV Charging Station Finder App

A full-stack React Native mobile application built with Expo for finding EV charging stations. Features include Google Maps integration, Firebase authentication, location services, and favorites management.

## Features

- 🔐 **Authentication** - Email/Password login and registration with Firebase
- 🗺️ **Google Maps** - Interactive map with custom styling
- 📍 **Location Services** - Get user location and display on map
- 🔍 **Search** - Search for locations and find nearby EV stations
- ⚡ **EV Stations** - Display nearby charging stations with details
- ❤️ **Favorites** - Save favorite stations with Firebase sync
- 📱 **Tab Navigation** - Home and Favorites tabs
- 🎨 **Modern UI** - Clean and intuitive user interface

## 🚀 Quick Start

### Step-by-Step Setup

**👉 Follow the complete setup guide: [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)**

This guide includes:
- ✅ Detailed Firebase setup
- ✅ Google Maps API configuration
- ✅ Step-by-step instructions with screenshots references
- ✅ Troubleshooting guide
- ✅ Complete checklist

### Quick Summary

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Firebase** (see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for details)
   - Create Firebase project
   - Enable Authentication & Firestore
   - Update `config/firebase.ts`

3. **Set up Google Maps** (see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for details)
   - Create Google Cloud project
   - Enable APIs & create keys
   - Update `app.json` and component files

4. **Run the app:**
   ```bash
   npm start
   ```
   Then press `a` for Android, `i` for iOS, or `w` for web.

## 📖 Documentation

- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - Complete step-by-step setup guide ⭐ **START HERE**
- **[SETUP.md](./SETUP.md)** - Technical setup details
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute quick setup
- **[CONFIGURATION_CHECKLIST.md](./CONFIGURATION_CHECKLIST.md)** - Verify all configurations

## Project Structure

```
├── app/
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── index.tsx    # Home screen with map
│   │   ├── favorites.tsx # Favorites screen
│   │   └── _layout.tsx  # Tab layout
│   ├── login.tsx        # Login/Register screen
│   └── _layout.tsx      # Root layout
├── components/          # Reusable components
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   └── StationList.tsx
├── config/             # Configuration files
│   └── firebase.ts
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── FavoritesContext.tsx
├── services/           # API services
│   └── evStations.ts
└── types/             # TypeScript types
    └── index.ts
```

## Configuration Required

Before running the app, you must configure:

1. **Firebase** (`config/firebase.ts`)
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     // ... other config
   };
   ```

2. **Google Maps API** (`app.json`)
   ```json
   {
     "ios": {
       "config": {
         "googleMapsApiKey": "YOUR_IOS_KEY"
       }
     },
     "android": {
       "config": {
         "googleMaps": {
           "apiKey": "YOUR_ANDROID_KEY"
         }
       }
     }
   }
   ```

3. **Google Places API** (in `components/SearchBar.tsx` and `services/evStations.ts`)
   - Replace `YOUR_GOOGLE_PLACES_API_KEY` with your actual key

## Features Breakdown

### Authentication
- Email/Password authentication
- Registration and login screens
- Protected routes
- Auto-redirect based on auth state

### Maps & Location
- Google Maps with custom dark theme
- User location tracking
- Location permissions handling
- Custom markers for stations and user location

### EV Stations
- Display nearby stations
- Station details (name, address, rating, price)
- Availability status
- Connector types
- Distance calculation

### Search
- Location search
- Find stations by address
- Google Places integration

### Favorites
- Add/remove favorites
- Firebase Firestore sync
- AsyncStorage fallback
- Favorites tab

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Firebase** - Authentication & Database
- **React Native Maps** - Map component
- **Expo Location** - Location services
- **TypeScript** - Type safety
- **Expo Router** - File-based routing

## Development

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Lint code
npm run lint
```

## Next Steps / Enhancements

- [ ] Integrate real EV station data API (Open Charge Map)
- [ ] Add station details screen
- [ ] Implement filters (connector type, availability, price)
- [ ] Add navigation/directions
- [ ] Push notifications
- [ ] Offline support
- [ ] User profile
- [ ] Reviews and ratings

## Troubleshooting

### Maps not showing
- Verify Google Maps API keys are correct
- Check API restrictions in Google Cloud Console
- Ensure billing is enabled

### Location not working
- Check app permissions in device settings
- Test on real device if emulator has issues

### Firebase errors
- Verify Firebase config
- Check Firestore security rules
- Ensure Authentication is enabled

## License

This project is open source and available for educational purposes.

## Support

For detailed setup instructions, see [SETUP.md](./SETUP.md)
