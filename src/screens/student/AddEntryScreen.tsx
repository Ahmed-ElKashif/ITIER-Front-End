import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { entryAPI } from '../../api/endpoints';
import { spacing } from '../../utils/theme';
import { useTheme } from "../../contexts/ThemeContext";

const schema = yup.object().shape({
  subject: yup.string().required('Subject is required'),
  hours: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Hours must be a number')
    .required('Hours is required')
    .positive('Hours must be positive')
    .max(24, 'Hours cannot exceed 24'),
  date: yup.date().required('Date is required'),
  notes: yup.string().ensure(),
});

type EntryFormData = yup.InferType<typeof schema>;

const COMMON_SUBJECTS = [
  'React Native',
  'TypeScript',
  'Node.js',
  'JavaScript',
  'HTML/CSS',
  'Git',
  'Algorithms',
  'Other',
];

export const AddEntryScreen = () => {
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      subject: '',
      hours: undefined,
      date: new Date(),
      notes: '',
    },
  });

  const onSubmit = async (data: EntryFormData) => {
    setIsLoading(true);
    try {
      const formattedDate = data.date.toISOString().split('T')[0];

      await entryAPI.create({
        subject: data.subject,
        hours: data.hours,
        date: formattedDate,
        notes: data.notes || undefined,
      });

      Alert.alert('Success', 'Study entry added successfully!', [
        {
          text: 'OK',
          onPress: () => reset(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to add entry',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Add Study Entry" showLogout />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Quick Subject Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Select Subject</Text>
          <View style={styles.subjectGrid}>
            {COMMON_SUBJECTS.map(subject => (
              <TouchableOpacity
                key={subject}
                style={[styles.subjectButton, isLoading && styles.disabledButton]}
                onPress={() => setValue('subject', subject)}
                disabled={isLoading}
              >
                <Text style={styles.subjectButtonText}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form */}
        <View style={styles.section}>
          <Controller
            control={control}
            name="subject"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Subject"
                placeholder="What did you study?"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.subject?.message}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="hours"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Hours"
                placeholder="How many hours?"
                value={value?.toString() || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.hours?.message}
                keyboardType="decimal-pad"
                editable={!isLoading}
              />
            )}
          />

          {/* Date Picker */}
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={[styles.dateButton, isLoading && styles.disabledButton]}
              onPress={() => setShowDatePicker(true)}
              disabled={isLoading}
            >
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            {errors.date && (
              <Text style={styles.error}>{errors.date.message}</Text>
            )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              maximumDate={new Date()}
              onChange={(_event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                  setValue('date', date);
                }
              }}
            />
          )}

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Notes (Optional)"
                placeholder="Any additional notes..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline
                numberOfLines={4}
                style={styles.notesInput}
                editable={!isLoading}
              />
            )}
          />

          <Button
            title="Add Entry"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  subjectButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subjectButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  dateContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  error: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing.md,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
