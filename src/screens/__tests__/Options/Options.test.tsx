/** @jest-environment jsdom */
import { render } from '@testing-library/react';
import Options from '../../Options/Options';
import React from 'react';

test('renders without crashing', () => {
  render(<Options />);
});
