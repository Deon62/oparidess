export const impactLight = async () => {
  try {
    const Haptics = require('expo-haptics');
    if (Haptics?.impactAsync && Haptics?.ImpactFeedbackStyle?.Light) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (_e) {
    // no-op
  }
};

export const impactMedium = async () => {
  try {
    const Haptics = require('expo-haptics');
    if (Haptics?.impactAsync && Haptics?.ImpactFeedbackStyle?.Medium) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch (_e) {
    // no-op
  }
};

export const notificationSuccess = async () => {
  try {
    const Haptics = require('expo-haptics');
    if (Haptics?.notificationAsync && Haptics?.NotificationFeedbackType?.Success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  } catch (_e) {
    // no-op
  }
};
