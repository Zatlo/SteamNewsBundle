import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';


import {
    getFromStorage
} from '../../utils/storage';

function copyElementToClipboard(element) {
    element = 'https://'+window.location.hostname + '/public/bundle/'+element;
    const el = document.createElement('textarea');
    el.value = element;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}


export default class Games extends Component { //class component
    constructor(props){
        super();

        this.state={
            bundle:'',
            games: [],
            searchResults: [],
            showCreateBundleForm: false
        }
    }

    componentDidMount() {
        this.setState({
            bundle: this.props.location.state.bundle
        })
        this.fetchBundleGamesData();
    }

    fetchBundleGamesData = () => {

        let objectID = this.props.location.state.bundle._id;
        axios.get('/bundles/steamgame/populate', {
            params: {
                bundleObjID: objectID
            }
        })
        .then(response=> {
            this.setState({games: response.data}) //gets all data of ob ject
        })
        .catch((error)=>{
            console.log(error);
        })

    }

    searchInputChange = e =>{//target is textbox
        var input = e.target.value;
        if (e.target.value.length >= 3) {
            input = input.toLowerCase();
            axios.get('/steamgames/games', {
            params: {
                userSearch: input
            }
            })
            .then(response=> {
                this.setState({searchResults: response.data}) //gets all data of ob ject
                return response.data;
            })
            .catch((error)=>{
                console.log(error);
            })
        }else {
            this.setState({searchResults: []})
            return [];
        }
    }

    showSearchResults(results){
        if(!results.length) return null;
        return results.map((result, index) => 
        (
            <ul key= {index}>
                <li style={{cursor: "pointer", borderWidth: "2px", border: "solid", }}>{result.name}</li> 
            </ul>
        ));
    }

    ViewNews(){

    }

    AddGameToBundle(game){
        console.log(game);
        const addGame={
            gameObjID: game._id,
            bundleObjID: this.state.bundle._id
        }
        axios.post('/bundles/steamgame/add', addGame)
        .then(res => {
            //console.log(res);
            if (res.data.success) {
                console.log('success in adding');
                console.log(res);
                window.location = window.location.href;
            }
            else{
                console.log('Failure in adding');
            }
        })
        .catch(err => {
            if(err.response){
                console.log(err.response.data.message)
            }
            else if(err.request){
                console.log(err.request)
            }
            else{
                console.log("else" + err)
            }
        });
    }

    gameDeleteIconOnClick(game){
        const deleteGame={
            token: getFromStorage('steam-news-bundles'),
            gameObjID: game._id,
            bundleObjID: this.state.bundle._id
        }

        axios.post('/bundles/game/delete', deleteGame)//sends data to backend
        .then(res => {
            //console.log(res);
            if (res.data.success) {
                console.log('success');
                window.location = window.location.href;
            }
        })
    }


    render(){
        return(
            <SearchCSS>
            <div>
                <div className='bundlesHeader'>
                    <h3>{this.state.bundle.name}
                    <IconButton onClick={() => copyElementToClipboard(this.state.bundle._id)} aria-label="delete">
                        <FileCopyIcon className="textColor" style={{fontSize: "1rem"}}/>
                    </IconButton>  
                    </h3>
                    <h3>    
                        <Link className="textColor" style={{border: "solid"}} 
                        to={{pathname:"/bundles/"+this.state.bundle.name+ "/news",
                        state:{bundle: this.state.bundle}}}>VIEW NEWS</Link>
                    </h3>
                </div>
                <div className="searchForm">
                    <form>
                    <input style={{width: "100%"}}
                        placeholder="Search for..."
                        onChange={this.searchInputChange}
                    />
                    </form>
                    
                    <div>
                        <ul style={{listStylePosition:"inside", paddingLeft: "0"}}>
                        {this.state.searchResults.map(item => (
                                <li className="searchResultsCSS" onClick={() => this.AddGameToBundle(item)}
                                style={{cursor:"pointer", border: "solid", listStyle: "none", borderWidth: "1px"}}
                                key={item._id}>{item.name}</li>
                        ))}
                        </ul>
                    </div>
                </div>

                    <br></br>
                    <div>{this.state.games.map(i => (<tr key={i._id} style={{fontWeight: "bold"}}>
                            <td>
                                <p>{i.name}</p>
                            </td>
                            <td>
                                <IconButton onClick={() => this.gameDeleteIconOnClick(i)} aria-label="delete">
                                <DeleteIcon className="textColor" style={{fontSize: "1rem"}}/>
                                </IconButton>   
                            </td>                        
                        </tr>))} 
                    </div>
            </div>
            </SearchCSS>
            
        )

    }
}


const SearchCSS = styled.footer`

.searchResultsCSS{
    :hover {
        color: blue;
    }
}`