import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './jsconsole/core/store';
import { Provider } from 'react-redux';
import './jsconsole/core/jsconsole.css';

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(React.createElement(Provider, { store }, <App />), document.getElementById('root'));
registerServiceWorker();
