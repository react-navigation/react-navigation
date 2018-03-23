import React from 'react';
import App from './App';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON();
  // Will be null because the playground uses state persistence which happens asyncronously
  expect(rendered).toEqual(null);
});
