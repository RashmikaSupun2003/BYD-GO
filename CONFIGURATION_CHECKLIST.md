# Configuration Checklist

Use this checklist to ensure all required configurations are completed before running the app.

## ✅ Firebase Configuration

- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Enabled Firestore Database
- [ ] Updated `config/firebase.ts` with your Firebase config:
  ```typescript
  apiKey: "YOUR_API_KEY"
  authDomain: "YOUR_AUTH_DOMAIN"
  projectId: "YOUR_PROJECT_ID"
  storageBucket: "YOUR_STORAGE_BUCKET"
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID"
  appId: "YOUR_APP_ID"
  ```
- [ ] Set up Firestore security rules (see SETUP.md)

## ✅ Google Maps & Places API

- [ ] Created Google Cloud project
- [ ] Enabled Maps SDK for Android
- [ ] Enabled Maps SDK for iOS
- [ ] Enabled Places API
- [ ] Enabled Geocoding API
- [ ] Created API keys (separate for iOS and Android recommended)
- [ ] Updated `app.json`:
  - [ ] iOS: `ios.config.googleMapsApiKey`
  - [ ] Android: `android.config.googleMaps.apiKey`
- [ ] Updated `components/SearchBar.tsx`: Replace `YOUR_GOOGLE_PLACES_API_KEY`
- [ ] Updated `services/evStations.ts`: Replace `YOUR_GOOGLE_PLACES_API_KEY`
- [ ] Set API key restrictions (optional but recommended)

## ✅ Dependencies

- [ ] Run `npm install` to install all dependencies
- [ ] Verify all packages installed successfully

## ✅ Permissions

- [ ] Location permissions configured in `app.json`
- [ ] Test location permissions on device/emulator

## ✅ Custom Fonts (Optional)

- [ ] Download font files
- [ ] Place fonts in `assets/fonts/` directory
- [ ] Update `app/_layout.tsx` to load fonts

## ✅ Testing

- [ ] Test authentication (login/register)
- [ ] Test map display
- [ ] Test location services
- [ ] Test search functionality
- [ ] Test favorites feature
- [ ] Test on Android emulator/device
- [ ] Test on iOS simulator/device (if applicable)

## Common Issues to Check

- [ ] Firebase config matches your project
- [ ] Google API keys are correct and not restricted incorrectly
- [ ] Billing enabled for Google Cloud project (required for Maps API)
- [ ] Location permissions granted on device
- [ ] Internet connection available
- [ ] Firestore rules allow user read/write

## Quick Test Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Need Help?

- Check [SETUP.md](./SETUP.md) for detailed instructions
- Check [README.md](./README.md) for overview
- Review error messages in console
- Verify all API keys and configurations












