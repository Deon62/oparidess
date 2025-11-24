# Oparides - Car Rental & Driver Hire App

A beautiful, minimalistic mobile application for car rental and driver hire services, built with React Native and Expo.

## Features

- **Three User Types:**
  - **Renters**: Browse and rent cars from owners
  - **Car Owners**: List and manage their cars for rent
  - **Drivers**: Offer driving services to users

- **Clean Architecture**: Organized code structure with packages for easy maintenance
- **Shared Screens**: Common authentication and utility screens
- **User-Specific Navigation**: Separate navigation flows for each user type

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Project Structure

```
oparides/
├── src/
│   ├── packages/
│   │   ├── components/     # Reusable UI components (Button, Input, Card)
│   │   ├── context/        # Context providers (UserContext)
│   │   ├── navigation/     # Navigation configuration
│   │   │   ├── AuthNavigator.js      # Authentication flow
│   │   │   ├── RenterNavigator.js    # Renter user flow
│   │   │   ├── OwnerNavigator.js     # Owner user flow
│   │   │   ├── DriverNavigator.js    # Driver user flow
│   │   │   └── MainNavigator.js      # Main router
│   │   └── theme/          # Theme and styling
│   └── screens/
│       ├── shared/         # Shared screens (Login, Signup, ResetPassword, Landing)
│       ├── renter/         # Renter-specific screens
│       ├── owner/          # Owner-specific screens
│       └── driver/         # Driver-specific screens
├── assets/                 # Images and static assets
├── App.js                  # Main app entry point
└── package.json
```

## Design Guidelines

The app follows a minimalistic, cute design with strict color guidelines:

- **Primary Brand**: Deep Navy #0A1D37
- **Background**: Soft White #F7F7F7
- **Text Primary**: Chocolate Black #1A1A1A
- **Text Secondary**: Charcoal #3A3A3A
- **Hint/Labels**: Muted Grey #6D6D6D

See `rules.md` for complete design guidelines.

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

