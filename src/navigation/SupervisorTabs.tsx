import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SupervisorTabParamList } from './types';
import { DashboardScreen } from '../screens/supervisor/DashboardScreen';
import { KPIDashboardScreen } from '../screens/supervisor/KPIDashboardScreen';
import { StudentsScreen } from '../screens/supervisor/StudentsScreen';
import { PendingStudentsScreen } from '../screens/supervisor/PendingStudentsScreen';
import { LeaderboardScreen } from '../screens/supervisor/LeaderboardScreen';

const Tab = createBottomTabNavigator<SupervisorTabParamList>();

export const SupervisorTabs = () => {
  return (
    <Tab.Navigator
      id="SupervisorTabs"
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Phase 2: KPI analytics */}
      <Tab.Screen
        name="KPIDashboard"
        component={KPIDashboardScreen}
        options={{
          tabBarLabel: 'KPIs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Phase 2: Pending approval queue */}
      <Tab.Screen
        name="PendingStudents"
        component={PendingStudentsScreen}
        options={{
          tabBarLabel: 'Pending',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsScreen}
        options={{
          tabBarLabel: 'Students',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: 'Leaderboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
