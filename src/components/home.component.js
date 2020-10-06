import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
//import axios from 'axios';
import "./home.component.css";
import "bootstrap/dist/css/bootstrap.min.css";


export default class HomePage extends Component {
    render() {
        return (
            <div class="homePage">
                <h1>Steam Gaming Bundle News</h1>
                <br></br>
                <div class="container">
                    <div class="jumbotron">
                        <h2>Most Popular Bundles</h2>
                    </div>

                    <div id="my-slider" class="carousel slide" data-ride="carousel">

                        <div class="carousel-inner" role="listbox">
                            <div class="item active">
                                <img src="background.jpg" alt="first"/>
                                <div class="carousel-caption">
                                    <h1>Purple 1</h1>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}