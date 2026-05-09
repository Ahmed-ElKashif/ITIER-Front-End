/**
 * ProgressBar Component
 * Single Responsibility: Visual horizontal progress indicator.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../../utils/theme';
import { useTheme } from "../../contexts/ThemeContext";

interface ProgressBarProps {
  label?: string;
  value: number;
  max?: number;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  color: propColor,
  showPercentage = false,
}) => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const color = propColor || colors.primary;
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      {(label || showPercentage) ? (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label} numberOfLines={1}>{label}</Text> : null}
          {showPercentage ? (
            <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
          ) : null}
        </View>
      ) : null}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%` as any, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
    marginRight: spacing.xs,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    minWidth: 32,
    textAlign: 'right',
  },
  track: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
