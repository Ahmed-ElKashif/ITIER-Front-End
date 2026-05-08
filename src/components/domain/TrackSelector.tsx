/**
 * TrackSelector Component
 * Container component: manages track selection state, renders list of TrackCards.
 * Wraps the useTracks hook to provide loading/error/retry UX.
 */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrackCard } from './TrackCard';
import { useTracks } from '../../hooks/useTracks';
import { colors, spacing } from '../../utils/theme';
import type { TrackWithStats } from '../../api/types';

interface TrackSelectorProps {
  selectedTrackId: number | null;
  onSelect: (track: TrackWithStats) => void;
}

export const TrackSelector: React.FC<TrackSelectorProps> = ({
  selectedTrackId,
  onSelect,
}) => {
  const { tracks, isLoading, error, refetch } = useTracks();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading available tracks…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="wifi-outline" size={40} color={colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (tracks.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="school-outline" size={40} color={colors.textSecondary} />
        <Text style={styles.emptyText}>
          No active tracks available at this time.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.label}>Select your track *</Text>
      <Text style={styles.sublabel}>
        {tracks.length} track{tracks.length !== 1 ? 's' : ''} available
      </Text>
      <FlatList
        data={tracks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TrackCard
            track={item}
            isSelected={selectedTrackId === item.id}
            onSelect={() => onSelect(item)}
          />
        )}
        scrollEnabled={false} // Parent ScrollView handles scrolling
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  retryButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sublabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
