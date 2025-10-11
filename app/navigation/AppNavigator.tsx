// app/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


import EcoComplianceHub from '../(tabs)/EcoComplianceHub';
import TopicDetail from '../(tabs)/TopicDetail';
import QuizPage from '../(tabs)/QuizPage';
// import AwarenessTips from '../tabs/AwarenessTips'; // When you create this

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="EcoComplianceHub" 
          component={EcoComplianceHub}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TopicDetail" 
          component={TopicDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="QuizPage" 
          component={QuizPage}
          options={{ headerShown: false }}
/>
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;