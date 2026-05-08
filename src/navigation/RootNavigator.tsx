import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { StudentTabs } from './StudentTabs';
import { SupervisorTabs } from './SupervisorTabs';
import { AdminTabs } from './AdminTabs';
import { RootStackParamList } from './types';
import { ActivityIndicator, View, StatusBar, Text, StyleSheet } from 'react-native';
import { colors } from '../utils/theme';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  /**
   * Route selection:
   * - Not authenticated → AuthStack (Login / Register / PendingApproval)
   * - ADMIN role → AdminTabs (dashboard, supervisors)
   * - SUPERVISOR role → SupervisorTabs (dashboard, KPIs, pending, students)
   * - STUDENT role (default) → StudentTabs (home, add, history, leaderboard)
   */
  const getTabScreen = () => {
    if (!isAuthenticated) return 'Auth';
    if (user?.role === 'ADMIN') return 'AdminTabs';
    if (user?.role === 'SUPERVISOR') return 'SupervisorTabs';
    return 'StudentTabs';
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <NavigationContainer>
        <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthStack} />
          ) : user?.role === 'ADMIN' ? (
            <Stack.Screen name="AdminTabs" component={AdminTabs} />
          ) : user?.role === 'SUPERVISOR' ? (
            <Stack.Screen name="SupervisorTabs" component={SupervisorTabs} />
          ) : (
            <Stack.Screen name="StudentTabs" component={StudentTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
