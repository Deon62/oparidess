# Supabase Setup Instructions

## Quick Setup

1. **Get your Supabase Anon Key:**
   - Go to https://app.supabase.com
   - Select your project
   - Navigate to Settings > API
   - Copy your "anon public" key

2. **Update Configuration:**
   - Open `src/packages/config/supabase.js`
   - Replace `YOUR_SUPABASE_ANON_KEY` with your actual anon key

3. **Verify Storage Bucket Name:**
   - Check that your bucket name in Supabase Storage matches `STORAGE_BUCKETS.CAR_IMAGES` in the config
   - Default is `carimages`

## Image Naming Convention

Images should be named following this pattern:
- `{carName}.jpg` (primary image)
- `{carName}1.jpg`
- `{carName}2.jpg`
- `{carName}3.jpg`

### Current Car Mappings:

- **Cars Near You (Essential)**: `x` → BMW X Series
  - Files: `x.jpg`, `x1.jpg`, `x3.jpg`, `x4.jpg`
  - ⚠️ Note: `x2.jpg` is missing - add it or the code will try to load a non-existent image

- **Premium Vehicles (Executive)**: `porsche` → Porsche 911
  - Files: `porsche.jpg`, `porsche1.jpg`, `porsche2.jpg`, `porsche3.jpg`

- **Elite Collection (Signature)**: `rolls` → Rolls Royce
  - Files: `rolls.jpg`, `rolls1.jpg`, `rolls2.jpg`, `rolls3.jpg`

- **Pickups**: `pickup` → Pickup Truck
  - Files: `pickup.jpg`, `pickup1.jpg`, `pickup2.jpg`, `pickup3.jpg`

## Video

All cars currently use the same video from Supabase Storage:
- Bucket: `carvideos`
- File: `video1.mp4`

## Testing

After setup:
1. Run `npm start`
2. Navigate to the home screen
3. Check that car images load from Supabase
4. Click on a car to see the carousel with all 4 images
5. Test the video toggle feature

## Troubleshooting

- **Images not loading**: Check that bucket is public or update RLS policies
- **Video not playing**: Verify video URL is accessible
- **Missing images**: Ensure all 4 images exist for each car (or update the code to handle missing images)

