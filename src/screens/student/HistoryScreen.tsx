import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Header } from '../../components/Header';
import { EntryCard } from '../../components/EntryCard';
import { entryAPI } from '../../api/endpoints';
import { StudyEntry } from '../../types';
import { spacing } from '../../utils/theme';
import { useTheme } from "../../contexts/ThemeContext";

export const HistoryScreen = () => {
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalHours, setTotalHours] = useState('0');

  const fetchEntries = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const response = await entryAPI.getMyEntries();
      setEntries(response.data.data);
      setTotalHours(response.data.meta.totalHours);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch entries');
      console.error('Fetch entries error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleDelete = async (entryId: number) => {
    try {
      await entryAPI.delete(entryId);
      Alert.alert('Success', 'Entry deleted');
      fetchEntries();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to delete entry');
    }
  };

  const handleEdit = (_entry: StudyEntry) => {
    // TODO: Implement edit modal (optional for MVP)
    Alert.alert('Edit', 'Edit functionality coming soon!');
  };

  const renderEntry = ({ item }: { item: StudyEntry }) => (
    <EntryCard
      entry={item}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No entries yet</Text>
      <Text style={styles.emptySubtext}>
        Start tracking your study time by adding your first entry!
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="History" showLogout />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="History" showLogout />

      {/* Stats Header */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{parseFloat(totalHours).toFixed(1)}</Text>
          <Text style={styles.statLabel}>Total Hours</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{entries.length}</Text>
          <Text style={styles.statLabel}>Entries</Text>
        </View>
      </View>

      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchEntries(true)}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: spacing.md,
    paddingTop: 0,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
