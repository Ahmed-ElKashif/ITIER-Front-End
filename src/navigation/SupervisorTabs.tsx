import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { SupervisorTabParamList } from './types';
import { DashboardScreen } from '../screens/supervisor/DashboardScreen';
import { StudentsScreen } from '../screens/supervisor/StudentsScreen';
import { LeaderboardScreen } from '../screens/supervisor/LeaderboardScreen';

const Tab = createBottomTabNavigator<SupervisorTabParamList>();

export const SupervisorTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
