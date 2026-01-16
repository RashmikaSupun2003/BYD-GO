# EV Charging Station Finder App

A full-stack React Native mobile application built with Expo for finding EV charging stations. Features include Google Maps integration, Firebase authentication, location services, and favorites management.

## Features

- 🔐 **Authentication** - Email/Password login and registration with clerk
- 🗺️ **Google Maps** - Interactive map with custom styling
- 📍 **Location Services** - Get user location and display on map
- 🔍 **Search** - Search for locations and find nearby EV stations
- ⚡ **EV Stations** - Display nearby charging stations with details
- ❤️ **Favorites** - Save favorite stations with Supabase sync
- 📱 **Tab Navigation** - Home and Favorites tabs
- 🎨 **Modern UI** - Clean and intuitive user interface

## 🚀 Quick Start


### Quick Summary

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up Google Maps** (see [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for details)
   - Create Google Cloud project
   - Enable APIs & create keys
   - Update `app.json` and component files

3. **Run the app:**
   ```bash
   npm start
   ```
   Then press `a` for Android, `i` for iOS, or `w` for web.


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
│   └── supabase.ts
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── FavoritesContext.tsx
├── services/           # API services
│   └── evStations.ts
└── types/             # TypeScript types
    └── index.ts
```


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
- **Clerk** - Authentication
- **Supeabase** - Database
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


## License

This project is open source and available for educational purposes.

