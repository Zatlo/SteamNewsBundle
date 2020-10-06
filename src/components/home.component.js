import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
//import axios from 'axios';
import "./home.component.css";


export default class HomePage extends Component {
    render() {
        return (
            <div class="homePage">
                <h1>Steam Gaming Bundles News</h1>
                <div class="jumbotron">
                    <div class="container">
                    <h1>Most Popular Bundles!</h1>
                    </div>
                </div>
            </div>
        )
    }
}