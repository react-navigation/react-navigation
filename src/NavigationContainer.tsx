import * as React from 'react';
import EnsureSingleNavigator from './EnsureSingleNavigator';
import { NavigationState, PartialState } from './types';

type Props = {
  initialState?: PartialState;
  onStateChange?: (state: NavigationState | PartialState | undefined) => void;
  children: React.ReactNode;
};

type State = {
  navigationState: NavigationState | PartialState | undefined;
};

const MISSING_CONTEXT_ERROR =
  "We couldn't find a navigation context. Have you wrapped your app with 'NavigationContainer'?";

export const NavigationStateContext = React.createContext<{
  state?: NavigationState | PartialState;
  getState: () => NavigationState | PartialState | undefined;
  setState: (state: NavigationState | undefined) => void;
  key?: string;
}>({
  get getState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
});

export default class NavigationContainer extends React.Component<Props, State> {
  state: State = {
    navigationState: this.props.initialState,
  };

  componentDidUpdate(_: Props, prevState: State) {
    const { onStateChange } = this.props;

    if (prevState.navigationState !== this.state.navigationState) {
      onStateChange && onStateChange(this.state.navigationState);
    }
  }

  private getNavigationState = () => this.state.navigationState;

  private setNavigationState = (navigationState: NavigationState | undefined) =>
    this.setState({ navigationState });

  render() {
    return (
      <NavigationStateContext.Provider
        value={{
          state: this.state.navigationState,
          getState: this.getNavigationState,
          setState: this.setNavigationState,
        }}
      >
        <EnsureSingleNavigator>{this.props.children}</EnsureSingleNavigator>
      </NavigationStateContext.Provider>
    );
  }
}
