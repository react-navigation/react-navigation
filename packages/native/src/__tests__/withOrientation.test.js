import React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import withOrientation, { isOrientationLandscape } from '../withOrientation';

it('adds isLandscape to props', () => {
  const WrappedComponent = withOrientation(View);
  const rendered = renderer.create(<WrappedComponent />).toJSON();
  expect(rendered).toMatchSnapshot();
});

it('calculates orientation correctly', () => {
  const isLandscape = isOrientationLandscape({ width: 10, height: 1 });
  expect(isLandscape).toBe(true);
});
