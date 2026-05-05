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
import { Header } from '../../components/Header';
import { StudentCard } from '../../components/StudentCard';
import { supervisorAPI } from '../../api/endpoints';
import { colors, spacing } from '../../utils/theme';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

export const StudentsScreen = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStudents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const response = await supervisorAPI.trackOverview();
      const studentList = response.data.data.students;
      setStudents(studentList);
      setFilteredStudents(studentList);
    } catch (error) {
      console.error('Fetch students error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter((student) =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const handleStudentPress = useCallback(async (student: any) => {
    try {
      const response = await supervisorAPI.studentDetails(student.userId);
      const details = response.data.data;

      const message = `
Student: ${details.student.fullName}
Email: ${details.student.email}
Total Hours: ${details.analytics.totalHours}
Total Entries: ${details.analytics.totalEntries}

Subject Breakdown:
${details.analytics.subjectBreakdown.map((s: any) => `${s.subject}: ${s.hours}h`).join('\n')}
      `;

      Alert.alert('Student Details', message.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch student details');
    }
  }, []);

  const renderStudent = ({ item }: { item: any }) => (
    <StudentCard student={item} onPress={() => handleStudentPress(item)} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No students found</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Students" showLogout />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Students" showLogout />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.userId.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchStudents(true)}
            colors={[colors.secondary]}
          />
        }
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    margin: spacing.md,
    marginBottom: 0,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingLeft: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
