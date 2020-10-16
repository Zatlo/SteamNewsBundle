import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';



export default class Games extends Component { //class component
    constructor(props){
        super();
        var str = window.location.href;

        this.state={
            bundle: str.split("/public/bundle/")[1],
            games: [],
            searchResults: [],
            showCreateBundleForm: false
        }
    }


    render(){
        return(
            <div style={{color:"White"}}>{this.state.bundle}</div>
        )
    }
}