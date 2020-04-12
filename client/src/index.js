import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import { MainMap } from './features/mainMap/MainMap';
import { Zone } from './features/zone/Zone';


ReactDOM.render(
  <Provider store={store}>
      <Router>
        <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/main_map" component={MainMap} />
        <Route exact path="/zone/:zoneId" component={Zone} />
        </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

