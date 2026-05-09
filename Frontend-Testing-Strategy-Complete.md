# Frontend Testing Strategy

This document outlines the testing strategy for the ITIER React Native Frontend application. It is designed to complement the `Backend-Testing-Strategy-Complete.md` file and ensures high confidence in our UI components, custom hooks, and network interactions.

## Core Principles

1. **Test Behavior, Not Implementation**: We use `@testing-library/react-native` to interact with components the same way a user would (finding elements by text, role, or testID) rather than inspecting internal component state.
2. **Isolate API Calls**: We use `axios-mock-adapter` to mock out `client.ts` responses. Frontend tests should *never* make actual network requests.
3. **Mock Native Modules Gracefully**: React Native relies on native modules (like Navigation, SafeArea, AsyncStorage). These are mocked globally in `jest.setup.js` so they don't crash our tests.

---

## 1. Directory Structure

Tests are co-located next to the file they are testing using the `.test.tsx` or `.test.ts` extension.

```text
src/
├── components/
│   ├── QuoteCard.tsx
│   └── QuoteCard.test.tsx      # Component tests
├── hooks/
│   ├── useAnalytics.ts
│   └── useAnalytics.test.ts    # Hook/API logic tests
```

---

## 2. Component Testing (UI & Interactions)

We use `@testing-library/react-native` to render components and verify what is displayed on the screen.

### Example: Testing a UI Component
```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { QuoteCard } from './QuoteCard';

describe('QuoteCard', () => {
  it('renders the quote and author correctly', () => {
    const mockQuote = { quote: "Test quote", author: "Author" };
    
    const { getByText } = render(<QuoteCard quote={mockQuote} />);
    
    // Verify elements exist on screen
    expect(getByText('Test quote')).toBeTruthy();
    expect(getByText('— Author')).toBeTruthy();
  });
});
```

---

## 3. Hook & API Testing (State & Logic)

We test custom hooks by rendering them in a testing wrapper. We use `axios-mock-adapter` to intercept network requests and return fake data.

### Example: Testing an API Hook
```tsx
import { renderHook, act, waitFor } from '@testing-library/react-native';
import axiosMockAdapter from 'axios-mock-adapter';
import apiClient from '../api/client';
import { useAnalytics } from './useAnalytics';

const mock = new axiosMockAdapter(apiClient);

describe('useAnalytics', () => {
  afterEach(() => {
    mock.reset(); // Reset network mocks between tests
  });

  it('fetches analytics data successfully', async () => {
    // 1. Mock the API response
    mock.onGet('/supervisor/track-overview').reply(200, {
      data: { trackName: 'Test Track', totalStudents: 5, students: [] }
    });

    // 2. Render the hook
    const { result } = renderHook(() => useAnalytics());

    // 3. Trigger the action
    act(() => {
      result.current.fetchAnalytics();
    });

    // 4. Wait for state to update and assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.overview?.trackName).toBe('Test Track');
    });
  });
});
```

---

## 4. Global Mocks (`jest.setup.js`)

To prevent tests from crashing due to missing native iOS/Android code, the following are globally mocked:
- `@react-navigation/native` (Provides fake `navigate` and `goBack` functions).
- `react-native-safe-area-context` (Removes padding requirements).
- `@react-native-async-storage/async-storage` (Uses an in-memory mock).

If you need to mock a specific screen's `route.params`, you can override the global mock locally in your test file using `jest.spyOn()`.

---

## 5. Running Tests

### Run all tests
```bash
npm test
```

### Run a specific test file
```bash
npm test -- QuoteCard.test.tsx
```

### Run tests in watch mode (interactive)
```bash
npm test -- --watch
```

---

**Checkpoint:** The testing framework is set up, `jest.setup.js` is configured, and developers can confidently add test coverage to frontend logic.
