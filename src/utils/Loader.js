import React from 'react';

const Loader = ({ isLoading, error}) => {
    if (isLoading) {
        return <div>Loading...</div>
    } else if (error) {
        return <div>Sorry, unable to load the page...</div>
    } else {
        return null;
    }
};

export default Loader;