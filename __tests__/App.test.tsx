/**
 * @format
 */

import 'react-native';

import { AppContainer } from '../src/EntryPoint/AppContainer';
import React from 'react';
import {it} from '@jest/globals';
import renderer from 'react-test-renderer';

// Note: import explicitly to use the types shiped with jest.


// Note: test renderer must be required after react-native.



it('renders correctly', () => {
  renderer.create(<AppContainer />);
});
