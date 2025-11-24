# Screens Structure Reference

This document outlines all screens in the Oparides app, organized by user type and shared screens.

## Shared Screens
Located in `src/screens/shared/`

These screens are accessible to all users before authentication or for common functions:

1. **LandingScreen** - Welcome/landing page
2. **UserTypeSelectionScreen** - Choose user type (Renter/Owner/Driver)
3. **LoginScreen** - User authentication
4. **SignupScreen** - User registration
5. **ResetPasswordScreen** - Password recovery

## Renter Screens
Located in `src/screens/renter/`

For users who want to rent cars:

1. **RenterHomeScreen** - Main dashboard for renters
2. **CarListScreen** - Browse available cars
3. **CarDetailsScreen** - View detailed car information
4. **BookingScreen** - Book a car rental
5. **RenterProfileScreen** - Renter profile and settings

## Owner Screens
Located in `src/screens/owner/`

For car owners who want to list their cars:

1. **OwnerHomeScreen** - Dashboard with stats and overview
2. **MyCarsScreen** - List of owner's cars
3. **AddCarScreen** - Add a new car listing
4. **EditCarScreen** - Edit existing car listing
5. **OwnerBookingsScreen** - View and manage bookings
6. **OwnerProfileScreen** - Owner profile and settings

## Driver Screens
Located in `src/screens/driver/`

For drivers offering driving services:

1. **DriverHomeScreen** - Main dashboard for drivers
2. **AvailableRidesScreen** - View available ride requests
3. **ActiveRideScreen** - Manage active ride
4. **DriverHistoryScreen** - View ride history
5. **DriverProfileScreen** - Driver profile and settings

## Navigation Flow

### Authentication Flow
```
Landing → UserTypeSelection → Signup/Login → [User Type Navigator]
```

### User-Specific Flows
- **Renter**: RenterHome → CarList → CarDetails → Booking
- **Owner**: OwnerHome → MyCars → AddCar/EditCar → OwnerBookings
- **Driver**: DriverHome → AvailableRides → ActiveRide → DriverHistory

## Adding New Screens

When adding new screens:

1. Place them in the appropriate folder (`shared/`, `renter/`, `owner/`, or `driver/`)
2. Import and add to the corresponding navigator file
3. Follow the naming convention: `[UserType][ScreenName]Screen.js` for user-specific screens, or `[ScreenName]Screen.js` for shared screens
4. Use the theme provider for consistent styling
5. Export reusable logic to packages when appropriate

