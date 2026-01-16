# EV Charging Station App - Complete Setup Guide

Follow these steps to set up and run your EV Charging Station Finder App.

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ Node.js installed (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ npm or yarn package manager
- ✅ A code editor (VS Code recommended)
- ✅ Android Studio (for Android) or Xcode (for iOS/Mac only)
- ✅ A Firebase account (free) - [Sign up here](https://firebase.google.com/)
- ✅ A Google Cloud account (free tier available) - [Sign up here](https://cloud.google.com/)

---

## Step 1: Install Dependencies

1. **Open your terminal/command prompt** in the project directory:
   ```bash
   cd d:\EV-Charging-Station-App
   ```

2. **Install all required packages**:
   ```bash
   npm install
   ```
   
   This will install all dependencies including React Native, Expo, Firebase, Maps, etc.
   
   ⏱️ *This may take 2-5 minutes*

---

## Step 2: Set Up Firebase

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `EV-Charging-Station-App` (or any name you prefer)
4. Click **Continue**
5. **Disable** Google Analytics (optional, you can enable later)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

### 2.2 Enable Authentication

1. In Firebase Console, click **Authentication** in the left menu
2. Click **Get started**
3. Click on **Sign-in method** tab
4. Click on **Email/Password**
5. **Enable** the first toggle (Email/Password)
6. Click **Save**

### 2.3 Enable Firestore Database

1. In Firebase Console, click **Firestore Database** in the left menu
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Click **Next**
5. Choose a location (select closest to you)
6. Click **Enable**

### 2.4 Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>` (even though it's a mobile app, we use web config)
5. Register app with nickname: `EV-Charging-App`
6. Click **Register app**
7. **Copy the `firebaseConfig` object** - it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 2.5 Update Firebase Config in Your Project

1. Open `config/firebase.ts` in your code editor
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",           // ← Replace this
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",   // ← Replace this
  projectId: "YOUR_ACTUAL_PROJECT_ID",     // ← Replace this
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET", // ← Replace this
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",   // ← Replace this
  appId: "YOUR_ACTUAL_APP_ID"             // ← Replace this
};
```

3. **Save the file**

---

## Step 3: Set Up Google Maps & Places API

### 3.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** dropdown at the top
3. Click **"New Project"**
4. Enter project name: `EV-Charging-Maps`
5. Click **Create**
6. Wait for project creation, then select it

### 3.2 Enable Required APIs

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for and enable these APIs (one by one):
   - **Maps SDK for Android** - Click "Enable"
   - **Maps SDK for iOS** - Click "Enable"
   - **Places API** - Click "Enable"
   - **Geocoding API** - Click "Enable"

### 3.3 Create API Keys

1. Go to **APIs & Services** > **Credentials**
2. Click **"+ CREATE CREDENTIALS"** > **API Key**
3. A popup will show your API key - **Copy it** (you'll need this)
4. Click **"Restrict key"** (recommended for security)
5. Under **API restrictions**, select **"Restrict key"**
6. Check these APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API
   - Geocoding API
7. Click **Save**

**Note:** You can create separate keys for Android and iOS, or use one key for both.

### 3.4 Enable Billing (Required for Maps API)

⚠️ **Important:** Google Maps API requires billing, but you get $200 free credit monthly.

1. Go to **Billing** in Google Cloud Console
2. Click **"Link a billing account"**
3. Follow the prompts to add a payment method
4. Don't worry - you get $200 free credit per month, which is more than enough for development

### 3.5 Update API Keys in Your Project

1. Open `app.json` in your code editor
2. Find these lines and replace with your API key:

```json
{
  "ios": {
    "config": {
      "googleMapsApiKey": "YOUR_ACTUAL_IOS_API_KEY"  // ← Replace this
    }
  },
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "YOUR_ACTUAL_ANDROID_API_KEY"  // ← Replace this
      }
    }
  }
}
```

**Note:** You can use the same API key for both iOS and Android if you didn't create separate keys.

3. Open `components/SearchBar.tsx`
4. Find this line (around line 25):
   ```typescript
   &key=YOUR_GOOGLE_PLACES_API_KEY
   ```
5. Replace `YOUR_GOOGLE_PLACES_API_KEY` with your actual API key

6. Open `services/evStations.ts`
7. Find this line (around line 67):
   ```typescript
   const API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY';
   ```
8. Replace `YOUR_GOOGLE_PLACES_API_KEY` with your actual API key

---

## Step 4: Set Up Firestore Security Rules

1. Go back to [Firebase Console](https://console.firebase.google.com/)
2. Click **Firestore Database** > **Rules** tab
3. Replace the rules with:

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

4. Click **Publish**

---

## Step 5: Run the App

### Option A: Run on Android Emulator

1. **Start Android Studio**
2. Open **AVD Manager** (Tools > Device Manager)
3. Create a virtual device if you don't have one:
   - Click **Create Device**
   - Select a device (e.g., Pixel 5)
   - Select a system image (e.g., Android 13)
   - Click **Finish**
4. Start the emulator
5. In your terminal, run:
   ```bash
   npm run android
   ```

### Option B: Run on iOS Simulator (Mac only)

1. Make sure Xcode is installed
2. Open **Simulator** app
3. Select a device (e.g., iPhone 14)
4. In your terminal, run:
   ```bash
   npm run ios
   ```

### Option C: Run on Physical Device

1. Install **Expo Go** app on your phone:
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. In your terminal, run:
   ```bash
   npm start
   ```

3. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app

### Option D: Run on Web Browser

1. In your terminal, run:
   ```bash
   npm start
   ```

2. Press **`w`** to open in web browser

**Note:** Maps won't work on web, but you can test other features.

---

## Step 6: Test the App

1. **Test Login/Register:**
   - The app should show a login screen
   - Click "Don't have an account? Sign Up"
   - Create a test account (e.g., test@example.com / password123)
   - You should be redirected to the home screen

2. **Test Location:**
   - The app will ask for location permission
   - Click **Allow**
   - You should see your location on the map

3. **Test Search:**
   - Type a location in the search bar
   - Press Enter or click search
   - The map should update to that location

4. **Test Favorites:**
   - Click the heart icon on any station
   - Go to the **Favorites** tab
   - You should see your favorited station

---

## 🐛 Troubleshooting

### Error: "Maps not showing"
- ✅ Check if API keys are correct in `app.json`
- ✅ Verify billing is enabled in Google Cloud Console
- ✅ Check if Maps SDK APIs are enabled
- ✅ Restart the app after changing API keys

### Error: "Can't login/register"
- ✅ Check Firebase config in `config/firebase.ts`
- ✅ Verify Email/Password auth is enabled in Firebase Console
- ✅ Check browser console for error messages

### Error: "Location not working"
- ✅ Grant location permissions in device settings
- ✅ Test on a real device (emulators sometimes have issues)
- ✅ Check if location services are enabled on your device

### Error: "Module not found"
- ✅ Run `npm install` again
- ✅ Delete `node_modules` folder and run `npm install`
- ✅ Clear cache: `npm start -- --clear`

### Build Errors
- ✅ Clear cache: `expo start -c`
- ✅ Delete `node_modules` and `.expo` folder, then `npm install`
- ✅ Make sure you're using Node.js v18 or higher

---

## ✅ Checklist

Before running the app, make sure you've completed:

- [ ] Installed dependencies (`npm install`)
- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Enabled Firestore Database
- [ ] Updated `config/firebase.ts` with your Firebase config
- [ ] Created Google Cloud project
- [ ] Enabled Maps SDK for Android
- [ ] Enabled Maps SDK for iOS
- [ ] Enabled Places API
- [ ] Enabled Geocoding API
- [ ] Created API keys
- [ ] Enabled billing in Google Cloud
- [ ] Updated `app.json` with API keys
- [ ] Updated `components/SearchBar.tsx` with API key
- [ ] Updated `services/evStations.ts` with API key
- [ ] Set up Firestore security rules

---

## 📱 Next Steps

Once your app is running:

1. **Test all features** to make sure everything works
2. **Customize the UI** to match your preferences
3. **Integrate real EV station data** (currently using mock data)
4. **Add more features** as needed
5. **Test on real devices** before deploying

---

## 📚 Need Help?

- Check the main [README.md](./README.md) for overview
- Check [SETUP.md](./SETUP.md) for detailed technical info
- Check [CONFIGURATION_CHECKLIST.md](./CONFIGURATION_CHECKLIST.md) to verify setup

---

## 🎉 You're Done!

Your EV Charging Station App should now be running! If you encounter any issues, refer to the troubleshooting section above.











