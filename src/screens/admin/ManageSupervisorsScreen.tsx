/**
 * ManageSupervisorsScreen — Phase 2
 * Responsibility: Create new supervisor accounts, view existing supervisors.
 *
 * Architecture:
 * - Uses useAdmin hook for all operations (SRP: no direct API calls)
 * - Uses useFormValidation + Rules for inline validation
 * - Create form is in a Modal (SRP: list vs form separation)
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useAdmin } from '../../hooks/useAdmin';
import { useFormValidation, Rules } from '../../hooks/useFormValidation';
import { spacing } from '../../utils/theme';
import type { SupervisorRecord } from '../../api/endpoints/admin.api';
import { useTheme } from "../../contexts/ThemeContext";

interface CreateForm {
  email: string;
  fullName: string;
}

const validationRules = {
  email: [Rules.required('Email is required'), Rules.email()],
  fullName: [Rules.required('Full name is required'), Rules.minLength(2)],
};

// ── SupervisorCard — presentational (SRP) ─────────────────────────────────────

const SupervisorCard: React.FC<{ item: SupervisorRecord }> = ({ item }) => {
  const { colors } = useTheme();
  const cardStyles = React.useMemo(() => createCardStyles(colors), [colors]);
  return (
  <View style={cardStyles.card}>
    <View style={cardStyles.row}>
      <View style={cardStyles.avatar}>
        <Text style={cardStyles.avatarText}>
          {item.fullName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={cardStyles.info}>
        <Text style={cardStyles.name}>{item.fullName}</Text>
        <Text style={cardStyles.email}>{item.email}</Text>
        <Text style={cardStyles.username}>@{item.username}</Text>
      </View>
    </View>
    {item.track ? (
      <View style={cardStyles.trackRow}>
        <Ionicons name="school-outline" size={14} color={colors.secondary} />
        <Text style={cardStyles.trackText}>{item.track.name}</Text>
        <View style={cardStyles.badge}>
          <Text style={cardStyles.badgeText}>{item.track.studentCount} students</Text>
        </View>
      </View>
    ) : (
      <Text style={cardStyles.noTrack}>No track created yet</Text>
    )}
  </View>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────

export const ManageSupervisorsScreen: React.FC = () => {
    const { colors } = useTheme();
      const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { supervisors, isLoading, fetchSupervisors, createSupervisor } = useAdmin();
  const { errors, validate, validateAll, clearAllErrors } =
    useFormValidation<CreateForm>(validationRules);

  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreateForm>({ email: '', fullName: '' });

  useEffect(() => {
    fetchSupervisors();
  }, [fetchSupervisors]);

  const resetForm = () => {
    setFormData({ email: '', fullName: '' });
    clearAllErrors();
    setShowModal(false);
  };

  const handleCreate = async () => {
    if (!validateAll(formData)) return;

    setIsCreating(true);
    const result = await createSupervisor(formData.email, formData.fullName);
    setIsCreating(false);

    if (result) {
      const credText = `Username: ${result.supervisor.username}\nPassword: ${result.temporaryPassword}`;
      Alert.alert(
        '✅ Supervisor Created',
        `${credText}\n\nShare these credentials securely.`,
        [
          {
            text: 'Copy Credentials',
            onPress: () => Clipboard.setString(credText),
          },
          { text: 'Done', onPress: resetForm },
        ],
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Supervisors" showLogout />

      {/* Sub-header with count + Add button */}
      <View style={styles.subHeader}>
        <Text style={styles.count}>
          {supervisors.length} supervisor{supervisors.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Supervisor</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={supervisors}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <SupervisorCard item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchSupervisors}
            colors={[colors.secondary]}
            tintColor={colors.secondary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.empty}>
              <Ionicons name="person-circle-outline" size={56} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No supervisors yet</Text>
              <Text style={styles.emptySubtext}>Tap "Add Supervisor" to create one</Text>
            </View>
          ) : null
        }
      />

      {/* Create Supervisor Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={resetForm}
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Supervisor</Text>
                <TouchableOpacity onPress={resetForm}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalHint}>
                A temporary password will be generated. Share it securely with the new supervisor.
              </Text>

              <Input
                label="Full Name *"
                value={formData.fullName}
                onChangeText={v => {
                  setFormData(prev => ({ ...prev, fullName: v }));
                  validate('fullName', v);
                }}
                error={errors.fullName}
                placeholder="e.g. Dr. Mohamed Ali"
                editable={!isCreating}
              />

              <Input
                label="Email *"
                value={formData.email}
                onChangeText={v => {
                  setFormData(prev => ({ ...prev, email: v }));
                  validate('email', v);
                }}
                error={errors.email}
                placeholder="supervisor@iti.gov.eg"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isCreating}
              />

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={resetForm}
                  variant="outline"
                  style={styles.modalBtn}
                  disabled={isCreating}
                />
                <Button
                  title={isCreating ? 'Creating…' : 'Create'}
                  onPress={handleCreate}
                  loading={isCreating}
                  style={styles.modalBtn}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  count: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: 4,
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  list: { padding: spacing.md },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.sm,
  },
  emptyText: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptySubtext: { fontSize: 14, color: colors.textSecondary },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.text },
  modalHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  modalBtn: { flex: 1 },
});

const createCardStyles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: colors.secondary },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  email: { fontSize: 13, color: colors.textSecondary },
  username: { fontSize: 12, color: colors.primary, marginTop: 2 },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  trackText: { fontSize: 13, color: colors.text, flex: 1 },
  badge: {
    backgroundColor: colors.secondary + '20',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, color: colors.secondary, fontWeight: '600' },
  noTrack: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
