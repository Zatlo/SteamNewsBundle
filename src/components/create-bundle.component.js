import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";


//button stuff
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

//storage
import {
    getFromStorage
} from '../utils/storage';


export default class BundleList extends Component { //class component
    constructor(props){
        super();

        this.onTextboxNewBundleName = this.onTextboxNewBundleName.bind(this);
        this.onTextboxNewBundleDescription  = this.onTextboxNewBundleDescription.bind(this);
        this.onSubmitNewBundle = this.onSubmitNewBundle.bind(this);

        this.state = {
            bundles: [],
            showCreateBundleForm: false,
            newBundleName: '',
            newBundleDescription: '',
            user: 'I am user',
        }; // em,pty list of exercises
    }

    
    componentDidMount(){ //get list of exercises from databnase
        const obj = getFromStorage('steam-news-bundles');
        if (obj && obj.token) {
            const { token } = obj;
            axios.get('/bundles/populate?token='+ token)
            .then(response=> {
                this.setState({bundles: response.data}) //gets all data of ob ject
            })
            .catch((error)=>{
                console.log(error);
            })
        }
        else{
            window.location = "/users/signin";
        }
    }



    displayBundlesNames=(bundles) => {
        if(!bundles.length) return null;
        return bundles.map((bundle, index) => 
        (
            <div key= {index}>
                <p><Link className="textColor"
                style={{fontWeight: "bold"}} 
                to={{pathname:"/bundles/"+ bundle.name, 
                state: { bundle: bundles[index]}}}>
                    {bundle.name}</Link></p> 
            </div>
        ));
    };

    displayBundlesDesc=(bundles) => {
        if(!bundles.length) return null;

        return bundles.map((bundle, index) => (
            <div key= {index}>
                <p className="textColor">{bundle.description}</p>
            </div>
        ));
    };

    displayBundleEditDelete=(bundles)=>{
        if(!bundles.length) return null;
                return bundles.map((bundle, index) => (
            <div key= {index}>
                <IconButton aria-label="delete">
                    <EditIcon className="textColor" style={{fontSize: "1rem"}}/>
                </IconButton>
                <IconButton onClick={() => this.bundleDeleteIconOnClick(bundle)} aria-label="delete">
                    <DeleteIcon className="textColor" style={{fontSize: "1rem"}}/>
                </IconButton>
            </div>
        ));
    };

    bundleDeleteIconOnClick(bundle){
        const deleteBundle={
            token: getFromStorage('steam-news-bundles'),
            bundleObjID: bundle._id
        }

        axios.post('/bundles/delete', deleteBundle)//sends data to backend
        .then(res => {
            //console.log(res);
            if (res.data.success) {
                console.log('success');
                window.location = window.location.href;
            }
        })
    }


    onTextboxNewBundleName(e) {
        this.setState({
            newBundleName: e.target.value//target is textbox
        });
    }
    
    onTextboxNewBundleDescription(e) {//target is textbox
        this.setState({
            newBundleDescription: e.target.value
        })
    }

    createNewBundle = () =>{ //create form under logged bundles and refresh page after

        return(
            <div> 
            <form id= "add-app" onSubmit={this.onSubmitNewBundle}>
                <label>Name:</label>
                <input 
                  type="text" 
                  required
                  className="form-control"
                  value={this.state.newBundleName}
                  onChange={this.onTextboxNewBundleName}
                  />

                <label>Description</label>
                <input 
                  type="text" 
                  required
                  className="form-control"
                  value={this.state.newBundleDescription}
                  onChange={this.onTextboxNewBundleDescription}
                  />

                <button>Create</button>
            </form>
            </div>
        );
    }


    onSubmitNewBundle(e){
        e.preventDefault();//prevents default html form submit behavior from taking place

        const bundle = {
            name: this.state.newBundleName,
            description: this.state.newBundleDescription,
            token: getFromStorage('steam-news-bundles')
        }
        axios.post('/bundles/add', bundle)//sends data to backend
        .then(res => {
            //console.log(res);
            if (res.data.success) {
                console.log('success');
                window.location = window.location.href;
            }
        })
        .catch(err => {
            if(err.response){
                console.log(err.response)
            }
            else if(err.request){
                console.log(err.request)
            }
            else{
                console.log("else" + err)
            }
        });
    }


    render() {
        return (
            <div>
                <div className='bundlesHeader'>
                    <h3>Bundles</h3>
                    <button onClick={() => this.setState({showCreateBundleForm: true})}>Create New Bundle</button>
                </div>
                <div>
                    {this.state.showCreateBundleForm ? this.createNewBundle() : null}
                </div>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                        <tr>
                            <td>{this.displayBundlesNames(this.state.bundles)}</td>
                            <td>{this.displayBundlesDesc(this.state.bundles)}</td>
                            <td>{this.displayBundleEditDelete(this.state.bundles)}</td>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        )
    }
}