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
        const pointerEvents = this.props.active && value ? 'box-none' : 'none';

        this.root && this.root.setNativeProps({ pointerEvents });
      })
    ),
  ]);

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
