import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, spacing } from '../utils/theme';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  return (
    <View style={styles.card}>
      <Icon name="format-quote-open" size={32} color={colors.primary} />
      <Text style={styles.quote}>{quote.quote}</Text>
      <Text style={styles.author}>— {quote.author}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.text,
    marginVertical: spacing.md,
    lineHeight: 24,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
