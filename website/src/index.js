import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import BrowserAppContainer from './BrowserAppContainer';

import './prism.css';
import './App.css';
import '@blueprintjs/core/dist/blueprint.css';

const ClientApp = BrowserAppContainer(App);

ReactDOM.render(<ClientApp />, document.getElementById('root'));
