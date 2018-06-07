import React from 'react';
import Loadable from 'react-loadable';
import Loader from './Loader';
const Loadermanager = func => Loadable({
    loading: Loader,
    loader: func
})

export default Loadermanager;