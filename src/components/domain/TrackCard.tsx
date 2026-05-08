/**
 * TrackCard Component
 * Presentational only — displays a single track option for selection.
 * Uses @expo/vector-icons (Ionicons) — no react-native-vector-icons needed.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../../utils/theme';
import type { TrackWithStats } from '../../api/types';

interface TrackCardProps {
  track: TrackWithStats;
  isSelected: boolean;
  onSelect: () => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  isSelected,
  onSelect,
}) => {
  const isDisabled = track.isFull;
  const capacityText = track.maxStudents
    ? `${track.currentStudents}/${track.maxStudents} students`
    : `${track.currentStudents} students`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isDisabled && styles.cardDisabled,
      ]}
      onPress={onSelect}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      {/* Header row: checkbox + FULL badge */}
      <View style={styles.header}>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
        {isDisabled && (
          <View style={styles.fullBadge}>
            <Text style={styles.fullBadgeText}>FULL</Text>
          </View>
        )}
      </View>

      {/* Track name */}
      <Text style={[styles.name, isDisabled && styles.nameDisabled]}>
        {track.name}
      </Text>

      {/* Description */}
      {track.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {track.description}
        </Text>
      ) : null}

      {/* Meta info row */}
      <View style={styles.metadata}>
        {track.duration ? (
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.metaText}>{track.duration}</Text>
          </View>
        ) : null}

        <View style={styles.metaItem}>
          <Ionicons
            name="people-outline"
            size={14}
            color={isDisabled ? colors.error : colors.textSecondary}
          />
          <Text
            style={[
              styles.metaText,
              isDisabled && { color: colors.error },
            ]}>
            {capacityText}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons
            name="person-circle-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.metaText} numberOfLines={1}>
            {track.supervisor}
          </Text>
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
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '12',
  },
  cardDisabled: {
    opacity: 0.55,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  fullBadge: {
    backgroundColor: colors.error,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  fullBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  nameDisabled: {
    color: colors.textSecondary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
