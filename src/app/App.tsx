import 'react-native-gesture-handler';
import React from 'react';
import { AuthProvider, useAuth } from '../auth/Authcontext';
import AuthStack from '../navigations/AuthStack';
import AppStack from '../navigations/AppStack';
import { ActivityIndicator, View, Text } from 'react-native';

const LoadingSplash = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Checking authentication...</Text>
  </View>
);


const RootNavigator = () => {
  const { isLoading, verifiedToken } = useAuth(); 

  if (isLoading) {
      return <LoadingSplash />;
  }
  return verifiedToken ? <AppStack /> : <AuthStack />;
};


export default function App() {
  return (  
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
  );
}