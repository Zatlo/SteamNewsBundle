import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
//import axios from 'axios';
import "./home.component.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';



export default class HomePage extends Component {

    constructor(props){
        super();

        this.state = {
            popularBundles: [],
        };
    }

    componentDidMount(){
        this.getHomePagePopularBundles();
    }

    getHomePagePopularBundles=()=> {
        //gets most popular bundles from database
        axios.get('/bundles/mostpopularbundles')
        .then(response=> {
            this.setState({popularBundles: response.data}) //gets all data of ob ject
            //now we need to call all games within each bundle
        })
        .catch((error)=>{
            console.log(error);
        })
    };


    //react elastic carousel?
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