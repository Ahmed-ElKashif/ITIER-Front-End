import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { StudentTabParamList } from './types';
import { HomeScreen } from '../screens/student/HomeScreen';
import { AddEntryScreen } from '../screens/student/AddEntryScreen';
import { HistoryScreen } from '../screens/student/HistoryScreen';
import { LeaderboardScreen } from '../screens/student/LeaderboardScreen';

const Tab = createBottomTabNavigator<StudentTabParamList>();

export const StudentTabs = () => {
  return (
    <Tab.Navigator
      id="StudentTabs"
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddEntry"
        component={AddEntryScreen}
        options={{
          title: 'Add Entry',
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
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
