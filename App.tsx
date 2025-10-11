// App.tsx (replace or merge carefully)
import React from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';

// existing screens
import OnboardingScreen from './app/(tabs)/Onboarding';
import Home from './app/(tabs)/Home';
import ShipMap from './app/(tabs)/ShipMap';

// new auth screens
import LoginScreen from './app/screens/Auth/LoginScreen';
import RegisterScreen from './app/screens/Auth/RegisterScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ShipMap: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppInner: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* If not signed in -> show auth flow (Login/Register + onboarding optionally) */}
        {!user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            {/* allow user to see onboarding before signing in */}
          </>
        ) : (
          <>
            {/* existing app routes for signed-in users */}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ShipMap" component={ShipMap} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <AppInner />
    </AuthProvider>
  );
};

export default App;
