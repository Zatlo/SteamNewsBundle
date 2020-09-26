import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


export default class GameNews extends Component { //class component
    constructor(props){
        super();
        this.state={
            bundle:'',
            games: [],
            gamenews: []
        }
    }

    componentDidMount(){
        this.setState({
            bundle: this.props.location.state.bundle
        })
        this.fetchBundleGamesData();
    }

    fetchBundleGamesData = () => {

        let objectID = this.props.location.state.bundle._id;
        axios.get('http://localhost:3000/bundles/steamgame/populate', {
            params: {
                bundleObjID: objectID
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

    fetchSteamApiNews=()=>{
        //call steam api
        //filter data
        var gamesinState = this.state.games;
        gamesinState.map(game => {
            axios.get('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid='+game.appid+'&count=4&maxlength=300&format=json')
            .then(response=> {

                var currGames = response.data.appnews.newsitems;
                currGames.map(currGame =>{
                    currGame.appid = game.name;
                    return currGame.appid;
                })
                this.setState({gamenews: [...this.state.gamenews, ...currGames]}) //gets all data of ob ject
                //order by date

                const myData = [].concat(this.state.gamenews)
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

    convertDateToReadable(date){
        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(date);

        return d.toString();
    }

    openExternalURL(link){
        window.open(link, '_blank');
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
        <span style={{color:"black"}} className="vertical-timeline-element-date">{this.convertDateToReadable(newsItem.date)}</span>
            </VerticalTimelineElement>
        ));
    };


    render(){
        return(
            <div>
                <div className='bundlesHeader'>
                    <h3>{this.state.bundle.name} News</h3>
                    <h3>    
                        <Link style={{color: "black", border: "solid"}} 
                        to={{pathname:"/bundles/"+this.state.bundle.name,
                        state:{bundle: this.state.bundle}}}>VIEW GAMES</Link>
                    </h3>
                </div>
                <VerticalTimeline animate={true}>
                    {this.displayGameNews(this.state.gamenews)}
                    <VerticalTimelineElement
                    >
                    </VerticalTimelineElement>

                </VerticalTimeline>
            </div>
        )

    }
}