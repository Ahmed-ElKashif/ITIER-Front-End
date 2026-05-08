import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { StudentCard } from '../../components/StudentCard';
import apiClient from '../../api/client';
import { colors, spacing } from '../../utils/theme';

export const StudentsScreen = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noTrack, setNoTrack] = useState(false);

  const fetchStudents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setNoTrack(false);

      const response = await apiClient.get('/supervisor/track-overview');
      const studentList = response.data.data.students ?? [];
      setStudents(studentList);
      setFilteredStudents(studentList);
    } catch (error: any) {
      console.error('Fetch students error:', error);
      if (error.response?.status === 403) {
        setNoTrack(true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          s =>
            s.fullName.toLowerCase().includes(q) ||
            s.username.toLowerCase().includes(q),
        ),
      );
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const handleStudentPress = useCallback(async (student: any) => {
    try {
      const response = await apiClient.get(`/supervisor/student/${student.userId}`);
      const details = response.data.data;

      const message = [
        `Email: ${details.student.email}`,
        `Total Hours: ${details.analytics.totalHours}`,
        `Total Entries: ${details.analytics.totalEntries}`,
        '',
        'Subject Breakdown:',
        ...details.analytics.subjectBreakdown.map(
          (s: any) => `  ${s.subject}: ${s.hours}h`,
        ),
      ].join('\n');

      Alert.alert(details.student.fullName, message);
    } catch {
      Alert.alert('Error', 'Failed to fetch student details');
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Students" showLogout />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </View>
    );
  }

  if (noTrack) {
    return (
      <View style={styles.container}>
        <Header title="Students" showLogout />
        <View style={styles.center}>
          <Ionicons name="people-outline" size={56} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Track Assigned</Text>
          <Text style={styles.emptySubtitle}>
            Students will appear here once your track is set up.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Students" showLogout />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or username…"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={({ item }) => (
          <StudentCard student={item} onPress={() => handleStudentPress(item)} />
        )}
        keyExtractor={item => item.userId.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyTitle}>No students found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchStudents(true)}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    margin: spacing.md,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingLeft: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  listContent: {
    padding: spacing.md,
  },
});
