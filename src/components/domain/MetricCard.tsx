/**
 * MetricCard Component
 * Presentational: Display a single KPI metric with icon and optional trend.
 * Uses @expo/vector-icons Ionicons — no react-native-vector-icons needed.
 */
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../utils/theme';

interface TrendProps {
  direction: 'up' | 'down';
  value: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  trend?: TrendProps;
  style?: ViewStyle;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  iconName,
  iconColor = colors.primary,
  trend,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={iconName} size={26} color={iconColor} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color: iconColor }]}>{value}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {/* Trend indicator */}
        {trend ? (
          <View style={styles.trend}>
            <Ionicons
              name={trend.direction === 'up' ? 'trending-up' : 'trending-down'}
              size={14}
              color={trend.direction === 'up' ? colors.secondary : colors.error}
            />
            <Text
              style={[
                styles.trendText,
                {
                  color:
                    trend.direction === 'up' ? colors.secondary : colors.error,
                },
              ]}
            >
              {trend.value}
            </Text>
          </View>
        ) : null}
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
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  content: { flex: 1 },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  value: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
