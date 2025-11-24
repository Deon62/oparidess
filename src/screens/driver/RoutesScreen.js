import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { WebView } from 'react-native-webview';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RoutesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { ride } = route.params || {};

  // Mock ride data if not provided
  const rideData = ride || {
    id: 1,
    pickupLocation: 'Nairobi CBD',
    dropoffLocation: 'Jomo Kenyatta Airport',
    pickupAddress: 'Nairobi CBD, Moi Avenue, Kenya',
    dropoffAddress: 'Jomo Kenyatta International Airport, Embakasi, Kenya',
    pickupCoordinates: { latitude: -1.2921, longitude: 36.8219 }, // Nairobi CBD
    dropoffCoordinates: { latitude: -1.3192, longitude: 36.9278 }, // JKIA
    distance: '18 km',
    duration: '45 min',
  };

  // Default coordinates if not provided
  const pickupCoords = rideData.pickupCoordinates || { latitude: -1.2921, longitude: 36.8219 };
  const dropoffCoords = rideData.dropoffCoordinates || { latitude: -1.3192, longitude: 36.9278 };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Route Directions',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Open in external navigation app
            const url = `https://www.google.com/maps/dir/?api=1&origin=${pickupCoords.latitude},${pickupCoords.longitude}&destination=${dropoffCoords.latitude},${dropoffCoords.longitude}&travelmode=driving`;
            // For iOS, you might want to use: `maps://maps.apple.com/?daddr=${dropoffCoords.latitude},${dropoffCoords.longitude}&dirflg=d`
            // Linking.openURL(url).catch(err => console.error('Failed to open navigation:', err));
          }}
          style={{ marginRight: 16 }}
          activeOpacity={0.7}
        >
          <Ionicons name="open-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
    // Hide tab bar on this screen
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [navigation, theme]);

  // Mapbox HTML with directions
  const mapboxHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js'></script>
      <link href='https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; overflow: hidden; }
        #map { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
      </style>
    </head>
    <body>
      <div id='map'></div>
      <script>
        try {
          mapboxgl.accessToken = 'pk.eyJ1IjoiZGVvbmNoaW5lc2UiLCJhIjoiY21odG82dHVuMDQ1eTJpc2RmdDdlZWZ3NiJ9.W0Nbf6fypzPbXgnMcOcoTA';
          
          const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [${(pickupCoords.longitude + dropoffCoords.longitude) / 2}, ${(pickupCoords.latitude + dropoffCoords.latitude) / 2}],
            zoom: 12,
            interactive: true,
            attributionControl: false
          });
          
          map.on('load', function() {
            // Add pickup marker
            const pickupMarker = new mapboxgl.Marker({ color: '#4CAF50' })
              .setLngLat([${pickupCoords.longitude}, ${pickupCoords.latitude}])
              .setPopup(new mapboxgl.Popup().setText('${rideData.pickupLocation || 'Pickup Location'}'))
              .addTo(map);
            
            // Add dropoff marker
            const dropoffMarker = new mapboxgl.Marker({ color: '#F44336' })
              .setLngLat([${dropoffCoords.longitude}, ${dropoffCoords.latitude}])
              .setPopup(new mapboxgl.Popup().setText('${rideData.dropoffLocation || 'Dropoff Location'}'))
              .addTo(map);
            
            // Fetch route from Mapbox Directions API
            const url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + 
              ${pickupCoords.longitude} + ',' + ${pickupCoords.latitude} + ';' + 
              ${dropoffCoords.longitude} + ',' + ${dropoffCoords.latitude} + 
              '?geometries=geojson&access_token=' + mapboxgl.accessToken;
            
            fetch(url)
              .then(response => response.json())
              .then(data => {
                if (data.routes && data.routes.length > 0) {
                  const route = data.routes[0].geometry;
                  
                  // Add route source
                  map.addSource('route', {
                    type: 'geojson',
                    data: {
                      type: 'Feature',
                      properties: {},
                      geometry: route
                    }
                  });
                  
                  // Add route layer
                  map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                      'line-join': 'round',
                      'line-cap': 'round'
                    },
                    paint: {
                      'line-color': '#0A1D37',
                      'line-width': 4,
                      'line-opacity': 0.8
                    }
                  });
                  
                  // Fit map to show route
                  const coordinates = route.coordinates;
                  const bounds = coordinates.reduce(function(bounds, coord) {
                    return bounds.extend(coord);
                  }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
                  
                  map.fitBounds(bounds, {
                    padding: { top: 100, bottom: 100, left: 50, right: 50 },
                    maxZoom: 15
                  });
                }
              })
              .catch(error => {
                console.error('Error fetching route:', error);
                // Fit map to show both markers if route fails
                const bounds = new mapboxgl.LngLatBounds()
                  .extend([${pickupCoords.longitude}, ${pickupCoords.latitude}])
                  .extend([${dropoffCoords.longitude}, ${dropoffCoords.latitude}]);
                
                map.fitBounds(bounds, {
                  padding: { top: 100, bottom: 100, left: 50, right: 50 },
                  maxZoom: 15
                });
              });
          });
          
          map.on('error', function(e) {
            console.error('Mapbox error:', e);
          });
        } catch (error) {
          console.error('Error initializing map:', error);
          document.getElementById('map').innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-family: Arial;">Map loading error</div>';
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Route Info Bar */}
      <View style={[styles.routeInfoBar, { backgroundColor: theme.colors.white }]}>
        {/* Top Row: Pickup and Dropoff */}
        <View style={styles.routeInfoRow}>
          <View style={[styles.routeInfoCard, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.routeInfoIcon, { backgroundColor: '#4CAF50' + '20' }]}>
              <Ionicons name="location" size={20} color="#4CAF50" />
            </View>
            <View style={styles.routeInfoContent}>
              <Text style={[styles.routeInfoLabel, { color: theme.colors.textSecondary }]}>
                Pickup
              </Text>
              <Text style={[styles.routeInfoText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {rideData.pickupLocation || 'Pickup Location'}
              </Text>
            </View>
          </View>
          
          <View style={[styles.routeInfoCard, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.routeInfoIcon, { backgroundColor: '#F44336' + '20' }]}>
              <Ionicons name="flag" size={20} color="#F44336" />
            </View>
            <View style={styles.routeInfoContent}>
              <Text style={[styles.routeInfoLabel, { color: theme.colors.textSecondary }]}>
                Dropoff
              </Text>
              <Text style={[styles.routeInfoText, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                {rideData.dropoffLocation || 'Dropoff Location'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Bottom Row: Distance and Duration */}
        {(rideData.distance || rideData.duration) && (
          <View style={styles.routeInfoRow}>
            <View style={[styles.routeInfoCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.routeInfoIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="navigate-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.routeInfoContent}>
                <Text style={[styles.routeInfoLabel, { color: theme.colors.textSecondary }]}>
                  Distance
                </Text>
                <Text style={[styles.routeInfoText, { color: theme.colors.textPrimary }]}>
                  {rideData.distance || 'N/A'}
                </Text>
              </View>
            </View>
            
            <View style={[styles.routeInfoCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.routeInfoIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.routeInfoContent}>
                <Text style={[styles.routeInfoLabel, { color: theme.colors.textSecondary }]}>
                  Duration
                </Text>
                <Text style={[styles.routeInfoText, { color: theme.colors.textPrimary }]}>
                  {rideData.duration || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: mapboxHTML }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          zoomEnabled={true}
          originWhitelist={['*']}
          mixedContentMode="always"
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
          }}
          onLoadEnd={() => {
            console.log('Routes map loaded successfully');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  routeInfoBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 12,
  },
  routeInfoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  routeInfoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    minWidth: 0,
  },
  routeInfoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeInfoContent: {
    flex: 1,
    minWidth: 0,
  },
  routeInfoLabel: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 4,
  },
  routeInfoText: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
  },
  map: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default RoutesScreen;

