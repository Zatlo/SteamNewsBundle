import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';
//import { Link } from "react-router-dom";
//import styled from 'styled-components';



export default class Games extends Component { //class component
    constructor(props){
        super();
        var str = window.location.href;

        this.state={
            bundle: str.split("/public/bundle/")[1],
            data: [],
        }
    }

    componentDidMount(){
        axios.get('/public/populatePublicBundle', {
            params: {
                bundleObjID: this.state.bundle
            }
        })
        .then(response=> {
            console.log(response);
            this.setState({data: response.data}) //gets all data of ob ject
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    fetchBundleGamesData = () => {
    }


    render(){
        return(
            <div>
                <h3 style={{color:"White"}}>{this.state.data.name}</h3>
            </div>
        )
    }
}