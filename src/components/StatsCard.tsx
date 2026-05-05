import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '../utils/theme';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = colors.primary,
}) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={32} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: spacing.md,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
