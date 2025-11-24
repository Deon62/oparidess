# Building APK for Oparides

## Prerequisites
1. Install EAS CLI: `npm install -g eas-cli`
2. Create an Expo account (if you don't have one): `eas login`

## Build Configuration
The app is configured with:
- **App Name**: "opa"
- **Package Name**: com.oparides.app
- **Icon**: assets/logo/logo.png
- **Version**: 1.0.0

## Building APK

### Option 1: Build Locally (Requires Android Studio)
```bash
# Prebuild native projects
npx expo prebuild

# Build APK
cd android
./gradlew assembleRelease
# APK will be in: android/app/build/outputs/apk/release/app-release.apk
```

### Option 2: Build with EAS (Recommended)
```bash
# Configure EAS (first time only)
eas build:configure

# Build APK
eas build --platform android --profile preview

# Or build AAB for Play Store
eas build --platform android --profile production
```

## Notes
- The app icon is set to `assets/logo/logo.png`
- Make sure the logo.png is square (recommended: 1024x1024px) for best results
- The app name displayed on device will be "opa"

