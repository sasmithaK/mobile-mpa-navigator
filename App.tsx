import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// Import your screens - adjust paths based on your project structure
// If these files are at the root level, use:
import OnboardingScreen from './app/(tabs)/Onboarding';
import Home from './app/(tabs)/Home';
import ShipMap from './app/(tabs)/ShipMap';

// OR if they're in app/(tabs), verify the path exists:
// import OnboardingScreen from './app/(tabs)/Onboarding';
// import Home from './app/(tabs)/Home';
// import ShipMap from './app/(tabs)/ShipMap';

// Define your navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ShipMap: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Onboarding"
          screenOptions={{ 
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#000' }
          }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ShipMap" component={ShipMap} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;