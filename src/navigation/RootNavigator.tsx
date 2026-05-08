import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { StudentTabs } from './StudentTabs';
import { SupervisorTabs } from './SupervisorTabs';
import { RootStackParamList } from './types';
import { ActivityIndicator, View, StatusBar } from 'react-native';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer>
        <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthStack} />
          ) : user?.role === 'STUDENT' ? (
            <Stack.Screen name="StudentTabs" component={StudentTabs} />
          ) : (
            <Stack.Screen name="SupervisorTabs" component={SupervisorTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
