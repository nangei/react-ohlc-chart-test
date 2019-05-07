import React from 'react';
import Loader from 'react-loader-spinner';

export default class App extends React.Component {
    //other logic
    render() {
        return ( 
            <Loader type = "Bars"
            color = "#17a2b8"
            height = "50"
            width = "50" />
        );
    }
}