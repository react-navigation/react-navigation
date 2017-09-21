import React, { Component } from 'react';
import Footer from './Footer';
import PhoneGraphic from './PhoneGraphic';

import CodeBlock from './CodeBlock';

import Link from './Link';

const GettingStartedButton = () =>
  <div className="cta-row">
    <Link className="cta" to="GettingStarted">
      <span className="label">Get Started</span>
      <span className="icon pt-icon-arrow-right" />
    </Link>
  </div>;

const ExampleCodeBrowser = (config, ExampleFiles) => {
  const fileNames = Object.keys(ExampleFiles);
  class CodeBrowser extends Component {
    state = { index: 0 };
    render() {
      const { index } = this.state;
      return (
        <div className={this.props.alt ? 'code-example alt' : 'code-example'}>
          <div className="code-example-section">
            <div className="code-section">
              <div className="code-browser-bar">
                {fileNames.map((fileName, i) => {
                  return (
                    <a
                      key={fileName}
                      className={index === i ? 'active' : ''}
                      onClick={() => this.setState({ index: i })}
                    >
                      {fileName}
                    </a>
                  );
                })}
              </div>
              <CodeBlock code={ExampleFiles[fileNames[index]]} />
            </div>
            <PhoneGraphic sources={config.examples} alt={this.props.alt} />
          </div>
        </div>
      );
    }
  }
  return CodeBrowser;
};

const StackExampleBrowser = ExampleCodeBrowser(
  {
    title: 'Stack Navigator',
    examples: {
      iphone: '/assets/iphone-stack.gif',
      android: '/assets/android-stack.gif',
    },
  },
  {
    'BasicApp.js': `\
import {
  StackNavigator,
} from 'react-navigation';

const BasicApp = StackNavigator({
  Main: {screen: MainScreen},
  Profile: {screen: ProfileScreen},
});
`,
    'MainScreen.js': `\
class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigate('Profile', { name: 'Jane' })
        }
      />
    );
  }
}`,
    'ProfileScreen.js': `\
class ProfileScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.name,
  });
  render() {
    const { goBack } = this.props.navigation;
    return (
      <Button
        title="Go back"
        onPress={() => goBack()}
      />
    );
  }
}`,
  }
);

const TabExampleBrowser = ExampleCodeBrowser(
  {
    title: 'Tab Navigator',
    examples: {
      iphone: '/assets/iphone-tabs.gif',
      android: '/assets/android-tabs.gif',
    },
  },
  {
    'BasicApp.js': `\
import {
  TabNavigator,
} from 'react-navigation';

const BasicApp = TabNavigator({
  Main: {screen: MainScreen},
  Setup: {screen: SetupScreen},
});
`,
    'MainScreen.js': `\
class MainScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Setup Tab"
        onPress={() => navigate('Setup')}
      />
    );
  }
}`,
    'SetupScreen.js': `\
class SetupScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Setup',
  };
  render() {
    const { goBack } = this.props.navigation;
    return (
      <Button
        title="Go back to home tab"
        onPress={() => goBack()}
      />
    );
  }
}`,
  }
);

class HomePage extends Component {
  static navigationOptions = {
    title: 'React Navigation',
  };
  render() {
    return (
      <div className="home-container">
        <div className="hero-bg" />
        <div className="home-body">
          <div className="hero">
            <h1>Navigation for React Native</h1>
            <div className="video">
              <iframe
                src="https://player.vimeo.com/video/201061589"
                width="720"
                height="410"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <GettingStartedButton />
          </div>

          <div className="section">
            <div className="section-inner">
              <h1>Easy-to-Use Navigators</h1>
              <h3>
                Start quickly with built-in navigators that deliver a seamless
                out-of-the box experience.
              </h3>

              <StackExampleBrowser />
            </div>
          </div>

          <div className="section alt">
            <div className="section-inner">
              <h1>Components built for iOS and Android</h1>
              <h3>
                Navigation views that deliver 60fps animations, and utilize
                native components to deliver a great look and feel.
              </h3>

              <TabExampleBrowser alt />
            </div>
          </div>

          <div className="section">
            <div className="section-inner">
              <h1>Routers built for the future</h1>
              <h3>
                Routers define the relationship between URIs, actions, and
                navigation state. Share navigation logic between mobile apps,
                web apps, and server rendering.
              </h3>
              <GettingStartedButton />
            </div>
          </div>

          <Footer />
        </div>
        <div className="hero-screen" />
      </div>
    );
  }
}

export default HomePage;
