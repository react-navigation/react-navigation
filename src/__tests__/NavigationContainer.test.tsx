import * as React from 'react';
import { render } from 'react-native-testing-library';
import NavigationContainer, {
  NavigationStateContext,
} from '../NavigationContainer';

it('throws when getState is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { getState } = React.useContext(NavigationStateContext);

    // eslint-disable-next-line babel/no-unused-expressions
    getState;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrowError(
    "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when setState is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { setState } = React.useContext(NavigationStateContext);

    // eslint-disable-next-line babel/no-unused-expressions
    setState;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrowError(
    "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when performTransaction is accessed without a container', () => {
  expect.assertions(1);

  const Test = () => {
    const { performTransaction } = React.useContext(NavigationStateContext);

    // eslint-disable-next-line babel/no-unused-expressions
    performTransaction;

    return null;
  };

  const element = <Test />;

  expect(() => render(element).update(element)).toThrowError(
    "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?"
  );
});

it('throws when setState is called outside performTransaction', () => {
  expect.assertions(1);

  const Test = () => {
    const { setState } = React.useContext(NavigationStateContext);

    React.useEffect(() => {
      setState(undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const element = (
    <NavigationContainer>
      <Test />
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "Any 'setState' calls need to be done inside 'performTransaction'"
  );
});

it('throws when nesting performTransaction', () => {
  expect.assertions(1);

  const Test = () => {
    const { performTransaction } = React.useContext(NavigationStateContext);

    React.useEffect(() => {
      performTransaction(() => {
        performTransaction(() => {});
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  };

  const element = (
    <NavigationContainer>
      <Test />
    </NavigationContainer>
  );

  expect(() => render(element).update(element)).toThrowError(
    "Only one transaction can be active at a time. Did you accidentally nest 'performTransaction'?"
  );
});
