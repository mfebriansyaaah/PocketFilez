import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Folder, Settings, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="files"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'android' ? 100 : 60,
          paddingBottom: Platform.OS === 'android' ? 40 : 10,
        },
        tabBarItemStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          tabBarIcon: ({ color, size }) => <Folder size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
