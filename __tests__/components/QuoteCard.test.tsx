import React from 'react';
import { render } from '@testing-library/react-native';
import { QuoteCard } from '../../src/components/QuoteCard';

describe('QuoteCard', () => {
  it('renders the quote text and author correctly', () => {
    const mockQuote = {
      quote: "The only limit to our realization of tomorrow will be our doubts of today.",
      author: "Franklin D. Roosevelt",
      category: "Inspirational"
    };

    const { getByText } = render(<QuoteCard quote={mockQuote} />);

    // Check if the quote text is rendered
    expect(getByText(mockQuote.quote)).toBeTruthy();

    // Check if the author text is rendered with the dash prefix
    expect(getByText(`— ${mockQuote.author}`)).toBeTruthy();
  });
});
