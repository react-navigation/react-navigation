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
  setState: (state: NavigationState | undefined, dangerously?: boolean) => void;
  key?: string;
  performTransaction: (action: () => void) => void;
}>({
  get getState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get setState(): any {
    throw new Error(MISSING_CONTEXT_ERROR);
  },
  get performTransaction(): any {
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

  private navigationState:
    | NavigationState
    | PartialState
    | undefined
    | null = null;

  private performTransaction = (action: () => void) => {
    this.setState(
      state => {
        this.navigationState = state.navigationState;
        action();
        return { navigationState: this.navigationState };
      },
      () => (this.navigationState = null)
    );
  };

  private getNavigationState = () =>
    this.navigationState || this.state.navigationState;

  private setNavigationState = (
    navigationState: NavigationState | undefined,
    dangerously = false
  ) => {
    if (this.navigationState === null && !dangerously) {
      throw new Error('setState need to be wrapped in a performTransaction');
    }
    if (dangerously) {
      this.setState({ navigationState });
    } else {
      this.navigationState = navigationState;
    }
  };

  render() {
    return (
      <NavigationStateContext.Provider
        value={{
          state: this.state.navigationState,
          getState: this.getNavigationState,
          setState: this.setNavigationState,
          performTransaction: this.performTransaction,
        }}
      >
        <EnsureSingleNavigator>{this.props.children}</EnsureSingleNavigator>
      </NavigationStateContext.Provider>
    );
  }
}
