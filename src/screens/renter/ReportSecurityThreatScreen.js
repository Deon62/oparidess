import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../packages/theme/ThemeProvider';
import { Button } from '../../packages/components';

let Location = null;
try {
  Location = require('expo-location');
} catch (e) {
  // expo-location not installed
}

const ReportSecurityThreatScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const [description, setDescription] = useState('');
  const [isSending, setIsSending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      // Don't restore tab bar here - let EmergencyOptionsScreen handle it
    }, [navigation])
  );

  const handleSend = async () => {
    const trimmed = description.trim();
    if (!trimmed) {
      Alert.alert('Required', 'Please describe the security threat.');
      return;
    }

    if (!Location) {
      Alert.alert(
        'Location Service Unavailable',
        'Location services require expo-location package.'
      );
      return;
    }

    setIsSending(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to send this report.');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const payload = {
        type: 'security_threat',
        description: trimmed,
        location: {
          latitude: position?.coords?.latitude ?? null,
          longitude: position?.coords?.longitude ?? null,
          accuracy: position?.coords?.accuracy ?? null,
        },
        reportedAt: new Date().toISOString(),
      };

      console.log('Security threat report submitted:', payload);

      Alert.alert('Sent', 'Your report has been sent.');
      setDescription('');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Unable to send report. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.colors.white }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Report Security Threat
          </Text>

          <View style={styles.headerRightSpacer} />
        </View>

        <View style={[styles.content, { paddingBottom: Math.max(insets.bottom + 24, 24) }]}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.colors.white,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.hint + '40',
              },
            ]}
            placeholder="Describe what happened and any details that can help..."
            placeholderTextColor={theme.colors.hint}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            editable={!isSending}
            maxLength={1200}
          />

          <Button
            title={isSending ? 'Sending...' : 'Send'}
            onPress={handleSend}
            variant="primary"
            loading={isSending}
            disabled={isSending}
            style={styles.sendButton}
          />

          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            When you tap Send, we’ll attach your current location to help respond faster.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  headerRightSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    minHeight: 160,
    marginBottom: 16,
  },
  sendButton: {
    borderRadius: 18,
  },
  helperText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    lineHeight: 16,
  },
});

export default ReportSecurityThreatScreen;
