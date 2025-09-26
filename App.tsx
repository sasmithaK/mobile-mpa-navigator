import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Home from './app/(tabs)/Home';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Home />
    </SafeAreaView>
  );
};

export default App;
