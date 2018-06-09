import Wallet from 'ethereumjs-wallet';
import axios from '../../utils/axios';
import { ecies } from '@settlemint/lib-crypto';
import Notifications from 'react-notification-system-redux';

// ------------------------------------
// Constants
// ------------------------------------

export const TOKEN_RECEIVED = 'TOKEN_RECEIVED';
export const ROLES_RECEIVED = 'ROLES_RECEIVED';
export const LOGOUT = 'LOGOUT';

// ------------------------------------
// Actions
// ------------------------------------

async function createNewWallet(axiosClient, email, password) {
  const walletResponse = await axiosClient.post('/wallet', {
    email: email,
    password: password
  });
  const { mnemonic, mnemonicHash, wallet } = walletResponse.data;
  return { mnemonic, mnemonicHash, wallet };
}

async function encryptedPrivateKeyAndAddress(wallet, password) {
  const walletObject = Wallet.fromV3(wallet, password);
  const privateKey = walletObject.getPrivateKey();
  const encryptedPrivateKey = ecies
    .encryptMessage(
      privateKey,
      Buffer.from(process.env.REACT_APP_SERVER_PUBLIC_KEY, 'hex'),
      privateKey
    )
    .toString('hex');
  return { encryptedPrivateKey, address: walletObject.getAddressString() };
}

async function storeKeys(axiosClient, email, address, keystore, mnemonicHash) {
  await axiosClient.post('/keystorage', {
    email,
    wallet: {
      ethereum: {
        address,
        keystore
      }
    },
    mnemonicHash
  });
}

async function getJWTToken(axiosClient, encryptedPrivateKey) {
  const tokenResponse = await axiosClient.post('/authenticate', {
    privateKeys: {
      ethereum: encryptedPrivateKey
    },
    encrypted: true
  });
  //console.log(tokenResponse);
  localStorage.setItem('jwtToken', tokenResponse.data.token);
  return tokenResponse.data.token;
}

export function register(values, { props, setErrors }) {
  //setSubmitting
  return async (dispatch, getState) => {
    const axiosClient = axios();
    try {
      // CREATE A NEW WALLET
      // console.log('CREATE A NEW WALLET');
      const { mnemonicHash, wallet } = await createNewWallet(
        axiosClient,
        values.email,
        values.password
      );
      // console.log({ mnemonicHash, wallet });
      // GET THE ADDRESS AND ENCRYPT THE PRIVATE KEY
      // console.log('GET THE ADDRESS AND ENCRYPT THE PRIVATE KEY');
      const {
        encryptedPrivateKey,
        address
      } = await encryptedPrivateKeyAndAddress(wallet, values.password);
      localStorage.setItem('address', address);

      // console.log({
      //   encryptedPrivateKey,
      //   address
      // });
      // STORE THE KEYS
      // console.log('STORE THE KEYS');
      await storeKeys(axiosClient, values.email, address, wallet, mnemonicHash);
      // console.log({
      //   done: true
      // });
      // GET THE JWT TOKEN
      const token = await getJWTToken(axiosClient, encryptedPrivateKey);

      localStorage.setItem('email', values.email);

      dispatch({
        type: TOKEN_RECEIVED,
        payload: { token, address }
      });
      // GET THE ROLES OF THE USER
      // TODO add JWT token to the axios client!
      // TODO enable back
      // const roleResponse = await axiosClient.get(
      //   `/wallet/roles?address=${encodeURIComponent(address)}`
      // );
      // localStorage.setItem('roles', roleResponse.data.roles);
      // dispatch({
      //   type: ROLES_RECEIVED,
      //   payload: { roles: roleResponse.data.roles }
      // });

      if (props.callBack) props.callBack();
    } catch (error) {
      //console.log(error);
      setErrors({
        email:
          (error.response &&
            error.response.data &&
            error.response.data.userMessage) ||
          error.message
      });
    }
    //setSubmitting(false);
  };
}

export function login(values, { props, setSubmitting, setErrors }) {
  return async (dispatch, getState) => {
    const axiosClient = axios();
    try {
      const retrieveResponse = await axiosClient.get(
        `/keystorage?email=${encodeURIComponent(values.email)}`
      );
      const { wallet } = retrieveResponse.data;
      // GET THE ADDRESS AND ENCRYPT THE PRIVATE KEY
      const {
        encryptedPrivateKey,
        address
      } = await encryptedPrivateKeyAndAddress(
        wallet.ethereum.keystore,
        values.password
      );
      localStorage.setItem('address', address);

      // GET THE JWT TOKEN
      const token = await getJWTToken(axiosClient, encryptedPrivateKey);
      dispatch({
        type: TOKEN_RECEIVED,
        payload: { token, address }
      });
      localStorage.setItem('email', values.email);

      // GET THE ROLES OF THE USER
      const authenticatedAxiosClient = axios(token);
      const roleResponse = await authenticatedAxiosClient.get(
        `/wallet/roles?address=${encodeURIComponent(address)}`
      );
      localStorage.setItem('roles', roleResponse.data.roles);
      dispatch({
        type: ROLES_RECEIVED,
        payload: { roles: roleResponse.data.roles }
      });
    } catch (error) {
      // console.log(error);
      setErrors({
        email:
          (error.response &&
            error.response.data &&
            error.response.data.userMessage) ||
          error.message
      });
    }
    setSubmitting(false);
  };
}

export function logout() {
  return async (dispatch, getState) => {
    try {
      // Remove all data from localStorage.
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('roles');
      localStorage.removeItem('address');
      localStorage.removeItem('email');

      // Remove all data from redux.
      dispatch({
        type: LOGOUT,
        payload: {}
      });
    } catch (e) {
      dispatch(
        Notifications.error({
          title: 'Something went wrong',
          message:
            'Could not log out. Contact support if this keeps happening.',
          position: 'tr',
          autoDismiss: 0
        })
      );
      console.error(e);
    }
  };
}

// ------------------------------------
// Action Handlers
// ------------------------------------

// Dispatching an action within a reducer is an anti-pattern.
// Your reducer should be without side effects, simply digesting the action payload and returning a new state object.

const ACTION_HANDLERS = {
  [TOKEN_RECEIVED]: (state, action) => {
    return {
      ...state,
      token: action.payload.token,
      address: action.payload.address
    };
  },
  [ROLES_RECEIVED]: (state, action) => {
    return {
      ...state,
      roles: action.payload.roles
    };
  },
  [LOGOUT]: (state, action) => {
    return {};
  }
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  token: localStorage.getItem('jwtToken') || false,
  roles: localStorage.getItem('roles') || [],
  address: localStorage.getItem('address') || null
};

function reducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

export { initialState, reducer };
