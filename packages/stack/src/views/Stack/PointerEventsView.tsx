import * as React from 'react';
import { View, ViewProps } from 'react-native';
import Animated from 'react-native-reanimated';

type Binary = 0 | 1;

type Props = ViewProps & {
  active: boolean;
  progress: Animated.Node<number>;
  children: React.ReactNode;
};

const MIN_PROGRESS = 0.99;

const TRUE = 1;
const FALSE = 0;
const NOOP = 0;

const { block, greaterThan, cond, set, call, onChange } = Animated;

/**
 * Component that automatically computes the `pointerEvents` property
 * whenever position changes.
 */
export default class PointerEventsView extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (this.props.active !== prevProps.active) {
      this.pointerEventsEnabled.setValue(this.props.active ? TRUE : FALSE);
      this.setPointerEventsEnabled(this.props.active);
    }
  }

  private pointerEventsEnabled = new Animated.Value<Binary>(
    this.props.active ? TRUE : FALSE
  );

  private exec = block([
    cond(
      greaterThan(this.props.progress, MIN_PROGRESS),
      cond(
        this.pointerEventsEnabled,
        NOOP,
        set(this.pointerEventsEnabled, TRUE)
      ),
      cond(this.pointerEventsEnabled, set(this.pointerEventsEnabled, FALSE))
    ),
    onChange(
      this.pointerEventsEnabled,
      call([this.pointerEventsEnabled], ([value]) => {
        this.setPointerEventsEnabled(Boolean(this.props.active && value));
      })
    ),
  ]);

  private setPointerEventsEnabled = (enabled: boolean) => {
    const pointerEvents = enabled ? 'box-none' : 'none';

    this.root && this.root.setNativeProps({ pointerEvents });
  };

  private root: View | null = null;

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { active, progress, ...rest } = this.props;

    return (
      <React.Fragment>
        <Animated.Code exec={this.exec} />
        <View ref={c => (this.root = c)} {...rest} />
      </React.Fragment>
    );
  }
}
