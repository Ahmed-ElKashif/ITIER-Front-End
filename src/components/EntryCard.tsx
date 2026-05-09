import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { spacing } from '../utils/theme';
import { StudyEntry } from '../types';
import { useTheme } from "../contexts/ThemeContext";

interface EntryCardProps {
  entry: StudyEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit, onDelete }) => {
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.subject}>{entry.subject}</Text>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
        <View style={styles.hoursContainer}>
          <Text style={styles.hours}>{parseFloat(entry.hours.toString()).toFixed(1)}</Text>
          <Text style={styles.hoursLabel}>hrs</Text>
        </View>
      </View>

      {entry.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {entry.notes}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Icon name="pencil" size={20} color={colors.primary} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
          <Icon name="delete" size={20} color={colors.error} />
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
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
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  hoursContainer: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    minWidth: 60,
  },
  hours: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  hoursLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  notes: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
  },
  deleteText: {
    color: colors.error,
  },
});
