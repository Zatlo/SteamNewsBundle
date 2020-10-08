import React, {Component } from 'react';
import {Link } from "react-router-dom";
import axios from 'axios';
import "./navbar.component.css";
import "bootstrap/dist/css/bootstrap.min.css";

import {
    getFromStorage
} from '../utils/storage';


//all components have to render something
export default class Navbar extends Component{


    constructor(props) {
        super(props);
    
        //this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {//state is how to use variables?
            signInOrLogOut: '',
            signInOrLogOutLink: '',
            username: ''
        }
        
    }

    componentDidMount() {
        const obj = getFromStorage('steam-news-bundles');
        if (obj && obj.token) {
          const { token } = obj;
          // Verify token or send them to sign in
          axios.get('/users/account/verify?token=' + token)
            .then(res => {
              if (res.data.success) {
                this.setState({
                    signInOrLogOut: 'Log Out',
                    signInOrLogOutLink: '/users/logout',
                    username: res.data.username
                });
              } else {
                console.log('not success in verified')
                this.setState({
                    signInOrLogOut: 'Sign in',
                    signInOrLogOutLink: '/users/signin'
                });
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
                    console.log("verify" + err)
                    //success 
                    //take person sucess page
                }
                this.setState({
                    signInOrLogOut: 'Sign in',
                    signInOrLogOutLink: '/users/signin'
                });
            })
        } 
        else{
            console.log('could not verify')
            this.setState({
                signInOrLogOut: 'Sign in',
                signInOrLogOutLink: '/users/signin'
            });
        }
      }


      getUserName(){
        return(
            <h3 style={{padding: '0', fontWeight:'400', textAlign: 'right', cursor: "default", color: '#fff'}}className="nav-link">{this.state.username}</h3>
        );
      }

      ChangeNavbar=()=>{
          if(this.state.signInOrLogOut === 'Log Out'){
              this.setState({
                signInOrLogOut: 'Sign in',
                signInOrLogOutLink: '/users/signin',
                username: ''
            })
          }
      }





    render(){
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">Steam News Bundles</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto navbar-right">
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/bundles" className="nav-link">Bundles</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/" className="nav-link">Other Page</Link>
                        </li>
                        <li className="navbar-item">
                        <Link onClick={() => this.ChangeNavbar()} to={this.state.signInOrLogOutLink} className="nav-link">{this.state.signInOrLogOut}</Link>
                        </li>
                        <li>
                        </li>
                        
                    </ul>
                    {this.getUserName()}
                </div>
            </nav>
        );
    }
}