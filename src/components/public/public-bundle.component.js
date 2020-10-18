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
            games: [],
            private: false
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
            if(response.data.message === 'private'){
                this.setState({private: true})
            }
            else{
                this.setState({data: response.data}) //gets all data of ob ject
                this.fetchBundleGamesData();
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    fetchBundleGamesData = () => {
        axios.get('/public/populatePublicBundleGames', {
            params: {
                gameIDs: this.state.data.games
            }
        })
        .then(response=> {
            this.setState({games: response.data}) //gets all data of ob ject
        })
        .catch((error)=>{
            console.log(error);
        })

    }

    PrivateWarning(props){
        if(props){
          return(
              <div>
                  <h3 style={{color: 'red'}}>I'm sorry, this bundle has been set to private. :(</h3>
              </div>
          )
        }      
      }




    render(){
        return(
            <div>
                {this.PrivateWarning(this.state.private)}
                <h3 style={{color:"White"}}>{this.state.data.name}</h3>
                <br></br>
                <div>{this.state.games.map(i => (<p key={i.appid} style={{fontWeight: "bold"}}>{i.name}</p>))} </div>
            </div>
        )
    }
}