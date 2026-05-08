/**
 * AdminTabs Navigator
 * Phase 2: Bottom tab navigation for ADMIN role.
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdminTabParamList } from './types';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { ManageSupervisorsScreen } from '../screens/admin/ManageSupervisorsScreen';

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminTabs = () => {
  return (
    <Tab.Navigator
      id="AdminTabs"
      screenOptions={{
        tabBarActiveTintColor: '#F44336',
        tabBarInactiveTintColor: '#757575',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ManageSupervisors"
        component={ManageSupervisorsScreen}
        options={{
          tabBarLabel: 'Supervisors',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
