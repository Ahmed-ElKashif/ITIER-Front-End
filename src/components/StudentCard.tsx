import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '../utils/theme';

interface StudentCardProps {
  student: {
    userId: number;
    fullName: string;
    username: string;
    weeklyHours: string;
    monthlyHours: string;
    lastStudyDate: string | null;
  };
  onPress: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onPress }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getActivityColor = () => {
    const hours = parseFloat(student.weeklyHours);
    if (hours >= 20) return colors.secondary;
    if (hours >= 10) return colors.primary;
    return colors.error;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{student.fullName}</Text>
          <Text style={styles.username}>@{student.username}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getActivityColor() }]}>
          <Icon name="fire" size={20} color="#fff" />
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{parseFloat(student.weeklyHours).toFixed(1)}h</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{parseFloat(student.monthlyHours).toFixed(1)}h</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatDate(student.lastStudyDate)}</Text>
          <Text style={styles.statLabel}>Last Active</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
});
