import React from 'react';
import ReactDOM from 'react-dom';
// import { unregister } from './registerServiceWorker';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Switch, Route, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import createStore from './redux/create-store';
import AuthContainer from './components/authentication/AuthContainer';
import LandingScreen from './components/landing/LandingScreen';
import DiscoverScreen from './components/discover/DiscoverScreen';
import PurchasesScreen from './components/purchases/PurchasesScreen';
import ListingsScreen from './components/listings/ListingsScreen';
import EnlistScreen from './components/listings/EnlistScreen';
import WalletScreen from './components/wallet/WalletScreen';
import StreamDetailsScreen from './components/stream-details/StreamDetailsScreen';
import UnsubscribedScreen from './components/unsubscribed/UnsubscribedScreen';
import Mixpanel from 'mixpanel-browser';
import { ThemeProvider } from 'styled-components';

import './styles/index.css';
import WebFontLoader from 'webfontloader';
import {
  userIsNotAuthenticatedRedir,
  userIsAuthenticatedRedir
} from './utils/auth';
import './index.css';
import theme from './utils/theme';

WebFontLoader.load({
  google: {
    families: ['Open Sans:300,400,500,700', 'Titillium Web:300,400,600,700,900', 'Material Icons']
  }
});

Mixpanel.init("544eb1c36a2ccbf02c7661d8b7525d81");

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__INITIAL_STATE__;
const history = createHistory();
const store = createStore(initialState, history);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/account" component={withRouter(userIsNotAuthenticatedRedir(AuthContainer))} />
            <Route path="/discover" component={withRouter(DiscoverScreen)} />
            <Route path="/purchases" component={withRouter(PurchasesScreen)} />
            <Route path="/listings" component={withRouter(ListingsScreen)} />
            <Route path="/enlist" component={withRouter(EnlistScreen)} />
            <Route path="/wallet" component={withRouter(userIsAuthenticatedRedir(WalletScreen))} />
            <Route path="/stream-details/:key" component={withRouter(StreamDetailsScreen)} />
            <Route path="/unsubscribed" component={withRouter(UnsubscribedScreen)} />
            <Route path="/" component={LandingScreen} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>,
    MOUNT_NODE
  );
};

// ========================================================
// Go!
// ========================================================

render();
registerServiceWorker();
// if (process.env.NODE_ENV === 'production') {
//   unregister(); // disable during dev/test
// }
