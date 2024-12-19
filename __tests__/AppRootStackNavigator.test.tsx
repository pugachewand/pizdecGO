import * as React from 'react';

import {describe, expect, it} from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { MainNavigator } from '../src/EntryPoint/MainNavigator';
import {NavigationContainer} from '@react-navigation/native';
import { act } from 'react-test-renderer';

// Note: import explicitly to use the types shiped with jest.



describe('Root Stack Navigation flow', () => {
  it('should render init page when opened', async () => {
    const component = (
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    );

    const {queryByText} = render(component);

    expect(queryByText('Init Screen')).toBeTruthy();
  });


  it('should render NotReady page when init failed', async () => {
    const component = (
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    );

    const {getByText, queryByText} = render(component);

    await act(async () => {
    await waitFor(() =>
      expect(queryByText('Error')).toBeTruthy()
    );

      fireEvent.press(getByText('Error'));
      
      await waitFor(() =>
      expect(
        queryByText('NotReady Screen')
        ).toBeTruthy()
        );
      });
    });
});
