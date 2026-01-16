# Quick Start Guide

Get your EV Charging Station App running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Firebase (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password**
4. Enable **Firestore Database** → Create database
5. Copy your config from Project Settings
6. Paste into `config/firebase.ts`

## Step 3: Configure Google Maps (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS  
   - Places API
   - Geocoding API
4. Create API keys (Credentials → Create Credentials → API Key)
5. Update `app.json`:
   - Replace `YOUR_IOS_GOOGLE_MAPS_API_KEY`
   - Replace `YOUR_ANDROID_GOOGLE_MAPS_API_KEY`
6. Update `components/SearchBar.tsx` and `services/evStations.ts`:
   - Replace `YOUR_GOOGLE_PLACES_API_KEY`

## Step 4: Run the App

```bash
npm start
```

Press `a` for Android or `i` for iOS.

## That's It! 🎉

Your app should now be running. If you see errors:

1. **Maps not showing?** → Check API keys in `app.json`
2. **Can't login?** → Check Firebase config in `config/firebase.ts`
3. **Location not working?** → Grant location permissions on device

## Next Steps

- See [SETUP.md](./SETUP.md) for detailed instructions
- See [CONFIGURATION_CHECKLIST.md](./CONFIGURATION_CHECKLIST.md) to verify everything
- Customize the app to your needs!

## Important Notes

⚠️ **Google Maps API requires billing** - You'll need to enable billing in Google Cloud Console (free tier available)

⚠️ **Firebase is free** - Free tier is sufficient for development

⚠️ **Test on real device** - Location services work better on real devices than emulators












