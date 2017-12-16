/**
 * @flow
 */

import * as React from 'react';

type Props = { sources: { android: string, iphone: string } };
type State = { activeExample: string };
export default class PhoneGraphic extends React.Component<Props, State> {
  state = { activeExample: this.props.alt ? 'android' : 'iphone' };
  render() {
    const { activeExample } = this.state;
    return (
      <div className="example-section">
        <div className="buttonbar">
          <a
            className={activeExample === 'android'}
            onClick={() => this.setState({ activeExample: 'android' })}
          >
            Android
          </a>
          <a
            className={activeExample === 'iphone'}
            onClick={() => this.setState({ activeExample: 'iphone' })}
          >
            iPhone
          </a>
        </div>
        <div className="phone">
          <div className={`android ${String(activeExample === 'android')}`}>
            <img src={this.props.sources.android} role="presentation" />
          </div>
          <div className="phone-example-spacer" />
          <div className={`iphone ${String(activeExample === 'iphone')}`}>
            <img src={this.props.sources.iphone} role="presentation" />
          </div>
        </div>
      </div>
    );
  }
}
