import React from 'react';
import '../styles/loader.css';

const Loader = ({isLoading, error}) => {
    if (isLoading) {
        return (
            <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
        )
    } else if (error) {
        return <div>Sorry, unable to load the page...</div>
    } else {
        return null;
    }
};

export default Loader;