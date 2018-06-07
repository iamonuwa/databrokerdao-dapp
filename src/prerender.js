import React from 'react';
import ReactDOMServer from 'react-dom/server';


const Loading = () => (
    <p>Loading...</p>
);

exports.prerender = () => {
    return ReactDOMServer.renderToString(<Loading />)
}