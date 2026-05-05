import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '../utils/theme';
import { LeaderboardEntry } from '../types';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entry,
  isCurrentUser,
}) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return colors.textSecondary;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return 'trophy';
    return 'account';
  };

  return (
    <View style={[styles.card, isCurrentUser && styles.currentUserCard]}>
      <View style={styles.rankContainer}>
        <Icon
          name={getRankIcon(entry.rank)}
          size={32}
          color={getRankColor(entry.rank)}
        />
        <Text style={[styles.rank, { color: getRankColor(entry.rank) }]}>
          #{entry.rank}
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={[styles.name, isCurrentUser && styles.currentUserName]}>
          {entry.fullName}
          {isCurrentUser && ' (You)'}
        </Text>
        <Text style={styles.subjects}>
          {entry.subjects.join(' • ')}
        </Text>
      </View>

      <View style={styles.hoursContainer}>
        <Text style={styles.hours}>{parseFloat(entry.totalHours).toFixed(1)}</Text>
        <Text style={styles.hoursLabel}>hrs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currentUserCard: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
    borderWidth: 2,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
    minWidth: 50,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  currentUserName: {
    color: colors.primary,
  },
  subjects: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  hoursContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.sm,
    minWidth: 60,
  },
  hours: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  hoursLabel: {
    fontSize: 10,
    color: '#fff',
  },
});
