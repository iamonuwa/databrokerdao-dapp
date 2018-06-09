import React from 'react';
import ReactDOM from 'react-dom';
// import { unregister } from './registerServiceWorker';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Switch, Route, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import createStore from './redux/create-store';
import Mixpanel from 'mixpanel-browser';
import { ThemeProvider } from 'styled-components';
import BigNumber from 'bignumber.js';

import Loadermanager from './utils/Loadermanager';
import './styles/index.css';
import WebFontLoader from 'webfontloader';
import {
  userIsNotAuthenticatedRedir,
  userIsAuthenticatedRedir
} from './utils/auth';
import './index.css';
import theme from './utils/theme';

const AuthContainer = Loadermanager(() => import('./components/authentication/AuthContainer'));
const LandingScreen = Loadermanager(() => import('./components/landing/LandingScreen'));
const DiscoverScreen = Loadermanager(() => import('./components/discover/DiscoverScreen'));
const PurchasesScreen = Loadermanager(() => import('./components/purchases/PurchasesScreen'));
const ListingsScreen = Loadermanager(() => import('./components/listings/ListingsScreen'));
const EnlistScreen = Loadermanager(() => import('./components/listings/EnlistScreen'));
const WalletScreen = Loadermanager(() => import('./components/wallet/WalletScreen'));
const StreamDetailsScreen = Loadermanager(() => import('./components/stream-details/StreamDetailsScreen'));
const UnsubscribedScreen = Loadermanager(() => import('./components/unsubscribed/UnsubscribedScreen'));

WebFontLoader.load({
  google: {
    families: [
      'Open Sans:300,400,500,700',
      'Titillium Web:300,400,600,700,900',
      'Material Icons'
    ]
  }
});

Mixpanel.init('544eb1c36a2ccbf02c7661d8b7525d81');

// Config bigbumber globally so it will display all numbers with enough decimals. We don't want any scientific notations!
BigNumber.config({ EXPONENTIAL_AT: 256 });

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
            <Route
              path="/account"
              component={withRouter(userIsNotAuthenticatedRedir(AuthContainer))}
            />
            <Route path="/streams" component={withRouter(StreamsScreen)} />
            <Route path="/purchases" component={withRouter(PurchasesScreen)} />
            <Route path="/listings" component={withRouter(ListingsScreen)} />
            <Route path="/enlist" component={withRouter(EnlistScreen)} />
            <Route path="/datasets" component={withRouter(DatasetsScreen)} />
            <Route
              path="/wallet"
              component={withRouter(userIsAuthenticatedRedir(WalletScreen))}
            />
            <Route
              path="/stream/:key"
              component={withRouter(StreamDetailsScreen)}
            />
            <Route
              path="/dataset/:key"
              component={withRouter(DatasetsDetailsScreen)}
            />
            <Route
              path="/unsubscribed"
              component={withRouter(UnsubscribedScreen)}
            />
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
