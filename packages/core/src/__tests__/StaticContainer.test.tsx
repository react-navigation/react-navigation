import * as React from 'react';
import { render } from 'react-native-testing-library';
import StaticContainer from '../StaticContainer';

it("doesn't update element if no props changed", () => {
  expect.assertions(2);

  const Test = ({ label }: any) => {
    return label;
  };

  const root = render(
    <StaticContainer count={42}>
      <Test label="first" />
    </StaticContainer>
  );

  expect(root).toMatchInlineSnapshot(`"first"`);

  root.update(
    <StaticContainer count={42}>
      <Test label="second" />
    </StaticContainer>
  );

  expect(root).toMatchInlineSnapshot(`"first"`);
});

it('updates element if any props changed', () => {
  expect.assertions(2);

  const Test = ({ label }: any) => {
    return label;
  };

  const root = render(
    <StaticContainer count={42}>
      <Test label="first" />
    </StaticContainer>
  );

  expect(root).toMatchInlineSnapshot(`"first"`);

  root.update(
    <StaticContainer count={123}>
      <Test label="second" />
    </StaticContainer>
  );

  expect(root).toMatchInlineSnapshot(`"second"`);
});

it('updates element if any props are added', () => {
  expect.assertions(2);

  const Test = ({ label }: any) => {
    return label;
  };

  const root = render(
    <StaticContainer count={42}>
      <Test label="first" />
    </StaticContainer>
  );

  expect(root).toMatchInlineSnapshot(`"first"`);

  root.update(
    <StaticContainer count={42} moreCounts={12}>
      <Test label="second" />
    </StaticContainer>
  );

  expect(root).toMatchInlineSnapshot(`"second"`);
});
