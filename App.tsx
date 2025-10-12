import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// Import your screens
import OnboardingScreen from './app/(tabs)/Onboarding';
import Home from './app/(tabs)/Home';
import ShipMap from './app/(tabs)/ShipMap';
import EcoComplianceHub from './app/(tabs)/EcoComplianceHub';
import VideoLearningPage from './app/(tabs)/VideoLearningPage';
import QuizPage from './app/(tabs)/QuizPage';
import Reports from './app/(tabs)/Reports';
import TopicDetail from './app/(tabs)/TopicDetail';

// Define your navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ShipMap: undefined;
  EcoComplianceHub: undefined;
  VideoLearningPage: undefined;
  QuizPage: undefined;
  Reports: undefined;
  TopicDetail: {
    topic: {
      id: number;
      title: string;
      subtitle: string;
      color: string;
      description: string;
      readTime: string;
    };
  };
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
          <Stack.Screen name="EcoComplianceHub" component={EcoComplianceHub} />
          <Stack.Screen name="VideoLearningPage" component={VideoLearningPage} />
          <Stack.Screen name="QuizPage" component={QuizPage} />
          <Stack.Screen name="Reports" component={Reports} />
          <Stack.Screen name="TopicDetail" component={TopicDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
