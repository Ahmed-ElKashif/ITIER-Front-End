import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing } from '../utils/theme';

interface HeaderProps {
  title: string;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showLogout = false }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {user && <Text style={styles.subtitle}>{user.fullName}</Text>}
      </View>
      {showLogout && (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color={colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    padding: spacing.sm,
  },
});
