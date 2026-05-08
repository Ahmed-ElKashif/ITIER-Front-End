/**
 * PendingStudentsScreen — Phase 2
 * Supervisor: review and approve/reject pending student registrations.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PendingStudentCard } from '../../components/domain/PendingStudentCard';
import { useApproval } from '../../hooks/useApproval';
import { colors, spacing } from '../../utils/theme';

export const PendingStudentsScreen: React.FC = () => {
  const { pendingStudents, isLoading, fetchPending, approveStudent, rejectStudent } =
    useApproval();
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (userId: number, studentName: string) => {
    setProcessingId(userId);
    await approveStudent(userId, studentName);
    setProcessingId(null);
  };

  const handleReject = async (
    userId: number,
    studentName: string,
    reason?: string,
  ) => {
    setProcessingId(userId);
    await rejectStudent(userId, studentName, reason);
    setProcessingId(null);
  };

  if (isLoading && pendingStudents.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading pending students…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pending Approvals</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{pendingStudents.length}</Text>
        </View>
      </View>

      {pendingStudents.length === 0 ? (
        // Empty state
        <View style={styles.emptyContainer}>
          <Ionicons
            name="checkmark-circle-outline"
            size={64}
            color={colors.secondary}
          />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>
            No students are currently awaiting approval.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pendingStudents}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <PendingStudentCard
              student={item}
              isProcessing={processingId === item.id}
              onApprove={() => handleApprove(item.id, item.fullName)}
              onReject={reason => handleReject(item.id, item.fullName, reason)}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchPending}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <Text style={styles.listHint}>
              Pull down to refresh • Approve or reject each student
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  countBadge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    minWidth: 26,
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  list: {
    padding: spacing.md,
  },
  listHint: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
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
});
