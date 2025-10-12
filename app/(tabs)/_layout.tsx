// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Home, FileText, ClipboardList } from 'lucide-react-native';

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: '#3b82f6',
//         tabBarInactiveTintColor: '#9ca3af',
//         tabBarStyle: {
//           backgroundColor: 'white',
//           borderTopColor: '#e5e7eb',
//           borderTopWidth: 1,
//           height: 60,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: '600',
//         },
//         headerStyle: {
//           backgroundColor: '#3b82f6',
//         },
//         headerTintColor: '#fff',
//         headerTitleStyle: {
//           fontWeight: '700',
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="Home"
//         options={{
//           title: 'Home',
//           headerShown: false,
//           tabBarIcon: ({ color, size }) => (
//             <Home size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="Reports"
//         options={{
//           title: 'Submit Report',
//           headerTitle: 'Submit Marine Report',
//           tabBarIcon: ({ color, size }) => (
//             <FileText size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="MyReports"
//         options={{
//           title: 'My Reports',
//           headerTitle: 'My Reports',
//           tabBarIcon: ({ color, size }) => (
//             <ClipboardList size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

