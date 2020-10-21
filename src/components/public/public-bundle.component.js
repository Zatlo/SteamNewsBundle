import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';
//import { Link } from "react-router-dom";
//import styled from 'styled-components';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import IconButton from '@material-ui/core/IconButton';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';



export default class Games extends Component { //class component
    constructor(props){
        super();
        var str = window.location.href;

        this.state={
            bundle: str.split("/public/bundle/")[1],
            data: [],
            games: [],
            steamJSON: [],
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
            this.fetchSteamApiNews();
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

    fetchSteamApiNews=()=>{
        //call steam api
        //filter data
        var gamesinState = this.state.games;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";

        gamesinState.map(game => {
            axios.get(proxyurl +'https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid='+game.appid+'&count=4&maxlength=300&format=json')
            .then(response=> {

                var currGames = response.data.appnews.newsitems;
                currGames.map(currGame =>{
                    currGame.appid = game.name;
                    return currGame.appid;
                })
                this.setState({steamJSON: [...this.state.steamJSON, ...currGames]}) //gets all data of ob ject
                //order by date

                const myData = [].concat(this.state.steamJSON)
                .sort((a, b) => a.date < b.date ? 1 : -1)
                this.setState({gamenews: myData})

                return;

                
            })
            .catch((error)=>{
                console.log(error);
            })
            return gamesinState;
        })

    }

    displayGameNews=(news) => {
        if(!news.length) return null;

        return news.map((newsItem, index) => (
            <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work"
                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                contentArrowStyle={{ borderRight: '15px solid  rgb(33, 150, 243)' }}
                iconStyle={{ cursor:"pointer", background: 'rgb(33, 150, 243)', color: '#fff', boxShadow:"0 0 20px rgb(33,150,243)" }}
                iconOnClick={() => this.openExternalURL(newsItem.url) }
            >
                <h3 className="vertical-timeline-element-title">{newsItem.appid}</h3>
                <br></br>
                <h4 style={{color: "lightgray"}}className="vertical-timeline-element-subtitle">{newsItem.title}</h4>
                <p>
                {newsItem.contents}
                </p>
                <br></br>
                <p>Click on the bubble to view more information!</p>
        <span className="vertical-timeline-element-date textColor">{this.convertDateToReadable(newsItem.date)}</span>
            </VerticalTimelineElement>
        ));
    };

    convertDateToReadable(date){
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(date);

        return d.toString();
    }

    likeBundle(bundleID){
        console.log("You have liked " + bundleID);

    }




    render(){
        return(
            <div>
                {this.PrivateWarning(this.state.private)}
                <div>
                    <h3 style={{color:"White", textAlign:"center", width: "100%"}}>{this.state.data.name}</h3>
                    <div style={{display: "flex", justifyContent: "center", verticalAlign: "middle", alignItems:"center"}}>
                        <h3 style={{border: "solid", marginBottom: "0px"}}>Follow</h3>
                        <IconButton onClick={() => this.likeBundle(this.state.bundle)}>
                        <ThumbUpOutlinedIcon className="textColor" style={{fontSize: "2.5rem", marginLeft: "20px" }}/>
                        </IconButton>
                    </div>
                </div>
                <br></br>
                <div>{this.state.games.map(i => (<p key={i.appid} style={{fontWeight: "bold"}}>{i.name}</p>))} </div>


                <VerticalTimeline animate={true}>
                    {this.displayGameNews(this.state.steamJSON)}
                    <VerticalTimelineElement
                    >
                    </VerticalTimelineElement>

                </VerticalTimeline>
            </div>
        )
    }
}