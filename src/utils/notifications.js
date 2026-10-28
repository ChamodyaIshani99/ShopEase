import { Platform } from 'react-native';

// Load expo-notifications safely: if the native module is missing
// (e.g. in Expo Go), the app keeps working without notifications.
let Notifications = null;
try {
  Notifications = require('expo-notifications');
} catch (e) {
  Notifications = null;
}

export async function setupNotifications() {
  if (!Notifications) return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Order updates',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }
  } catch (e) {
    console.warn('Notification setup skipped:', e?.message);
  }
}

export async function notifyOrderPlaced(orderId) {
  if (!Notifications) return;
  try {
    // Immediate confirmation
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Order confirmed 🎉',
        body: `Your order ${orderId} has been placed successfully.`,
      },
      trigger: null,
    });

    // "Shipped" update after 60 seconds
    const type = Notifications.SchedulableTriggerInputTypes?.TIME_INTERVAL;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your order is on the way 🚚',
        body: `Order ${orderId} has been shipped.`,
      },
      trigger: type ? { type, seconds: 60 } : { seconds: 60 },
    });
  } catch (e) {
    console.warn('Could not schedule notification:', e?.message);
  }
}