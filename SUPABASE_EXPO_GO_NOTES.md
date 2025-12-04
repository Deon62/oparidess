# Supabase with Expo Go - Important Notes

## Current Setup

✅ **Images Work in Expo Go**: Car images are loaded using direct URL construction, which works perfectly in Expo Go.

⚠️ **Auth Requires Development Build**: The Supabase client (`@supabase/supabase-js`) has Node.js dependencies that don't work in Expo Go. For account creation, authentication, and database features, you'll need to use a **development build** instead of Expo Go.

## What Works in Expo Go

- ✅ Loading car images from Supabase Storage (using direct URLs)
- ✅ Displaying images in car cards and carousels
- ✅ Video playback (using WebView)

## What Requires Development Build

- ⚠️ User authentication (signup/login)
- ⚠️ Account creation
- ⚠️ Profile updates
- ⚠️ Database queries
- ⚠️ File uploads to Supabase Storage

## Solution

### For Testing Images (Current):
- Continue using Expo Go - images will work fine

### For Full Features (Auth, Database):
1. Create a development build:
   ```bash
   npx expo install expo-dev-client
   npx expo run:android
   # or
   npx expo run:ios
   ```

2. Or use EAS Build:
   ```bash
   eas build --profile development --platform android
   ```

## Configuration

Your Supabase client is already configured with:
- ✅ URL: `https://gfckrsileizyfyawanvh.supabase.co`
- ✅ Publishable Key: Configured
- ✅ expo-sqlite for localStorage
- ✅ Auth settings for React Native

The configuration will work automatically once you switch to a development build.

## Image Buckets

Current bucket configuration:
- `carimages` - Car images (works in Expo Go)
- `carvideos` - Car videos (works in Expo Go)
- `profileimages` - Profile images (needs dev build for uploads)
- `documents` - Documents (needs dev build for uploads)

