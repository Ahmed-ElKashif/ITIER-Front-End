import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { StatsCard } from '../../components/StatsCard';
import { Button } from '../../components/Button';
import { QuoteCard } from '../../components/QuoteCard';
import apiClient from '../../api/client';
import { createTrack } from '../../api/endpoints/track.api';
import { quoteAPI } from '../../api/endpoints';
import { colors, spacing } from '../../utils/theme';
import { Quote } from '../../types';

export const DashboardScreen = () => {
  const [trackData, setTrackData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noTrack, setNoTrack] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [trackDesc, setTrackDesc] = useState('');
  const [trackDuration, setTrackDuration] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setNoTrack(false);

      try {
        const quoteRes = await quoteAPI.daily();
        setQuote(quoteRes.data.data);
      } catch (e) {
        // Silent catch for quotes
      }

      const response = await apiClient.get('/supervisor/track-overview');
      setTrackData(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setNoTrack(true);
      } else {
        console.error('Dashboard error:', error);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleCreateTrack = async () => {
    if (!trackName.trim()) {
      Alert.alert('Required', 'Please enter a track name.');
      return;
    }
    
    setIsCreating(true);
    try {
      await createTrack({
        name: trackName,
        description: trackDesc || undefined,
        duration: trackDuration || undefined,
        maxStudents: maxStudents ? parseInt(maxStudents, 10) : undefined,
      });
      setShowCreateModal(false);
      fetchDashboard();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create track');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Dashboard" showLogout />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </View>
    );
  }

  // Supervisor has no track assigned yet
  if (noTrack) {
    return (
      <View style={styles.container}>
        <Header title="Dashboard" showLogout />
        <View style={styles.emptyContainer}>
          {quote && <QuoteCard quote={quote} />}
          <Ionicons name="school-outline" size={64} color={colors.textSecondary} style={{ marginTop: quote ? spacing.xl : 0 }} />
          <Text style={styles.emptyTitle}>No Track Yet</Text>
          <Text style={styles.emptySubtitle}>
            You haven't created a track yet. Create one now to start adding students and monitoring their progress!
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.retryText}>Create My Track</Text>
          </TouchableOpacity>
        </View>

        {/* Create Track Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          transparent
          onRequestClose={() => setShowCreateModal(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Track</Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalForm}>
                <Text style={styles.inputLabel}>Track Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Frontend React Native"
                  value={trackName}
                  onChangeText={setTrackName}
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What is this track about?"
                  value={trackDesc}
                  onChangeText={setTrackDesc}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Duration</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 9 months"
                  value={trackDuration}
                  onChangeText={setTrackDuration}
                  placeholderTextColor={colors.textSecondary}
                />

                <Text style={styles.inputLabel}>Max Students (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 50"
                  value={maxStudents}
                  onChangeText={setMaxStudents}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />

                <Button
                  title={isCreating ? 'Creating...' : 'Create Track'}
                  onPress={handleCreateTrack}
                  loading={isCreating}
                  style={styles.submitBtn}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Dashboard" showLogout />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchDashboard(true)}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
      >
        {/* Daily Quote */}
        {quote && <QuoteCard quote={quote} />}

        {/* Track Info Banner */}
        <View style={styles.trackHeader}>
          <Text style={styles.trackName}>{trackData?.trackName ?? '—'}</Text>
          <Text style={styles.trackSubtitle}>
            {trackData?.totalStudents ?? 0} Students enrolled
          </Text>
        </View>

        {/* Track Stats */}
        <StatsCard
          title="Average Weekly Hours"
          value={trackData?.trackStats?.averageWeeklyHours || '0'}
          subtitle="Per student this week"
          icon="chart-line"
          color={colors.secondary}
        />

        <StatsCard
          title="Most Studied Subject"
          value={trackData?.trackStats?.mostStudiedSubject || 'N/A'}
          subtitle="Across all students this week"
          icon="book-open-variant"
          color={colors.primary}
        />

        <StatsCard
          title="Total Students"
          value={trackData?.totalStudents?.toString() || '0'}
          subtitle="In your track"
          icon="account-group"
          color={colors.secondary}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.md,
  },
  trackHeader: {
    backgroundColor: colors.secondary + '12',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  trackName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  trackSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  modalForm: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.xl * 2, // Extra padding for scroll
  },
});
