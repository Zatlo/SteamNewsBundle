import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';

import {
    setInStorage,
    getFromStorage
} from '../utils/storage';



export default class SignIn extends Component{ ////need to always call super when calling constructor of subclass

    constructor(props) {
        super(props);
    
        this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
        this.onTextboxChangeSignInPassword  = this.onTextboxChangeSignInPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {//state is how to use variables?
            signInEmail: '',
            signInPassword: '',
            signInError: '',
            token: ''
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
                  console.log('verified')
                this.setState({
                  token,
                });
                window.location = '/';
              } else {
                console.log('not success in verified')
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
            })
        } 
        else{
            console.log('could not verify')
        }
      }



    onTextboxChangeSignInEmail(e) {
        this.setState({
            signInEmail: e.target.value//target is textbox
        });
    }
    
    onTextboxChangeSignInPassword(e) {//target is textbox
        this.setState({
            signInPassword: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();//prevents default html form submit behavior from taking place
    
        const user = {
            email: this.state.signInEmail,
            password: this.state.signInPassword,
        }
    
        //console.log(user);
    
        axios.post('/users/account/signin', user)//sends data to backend
        .then(res => {
            console.log(res)
            if (res.data.success) {
                setInStorage('steam-news-bundles', { token: res.data.token });
                this.setState({
                  signInError: res.message,
                  isLoading: false,
                  signInPassword: '',
                  signInEmail: '',
                  token: res.data.token,
                });
                window.location = '/';
            }
        })
        .catch(err => {
            if(err.response){
                console.log(err.response)
                this.setState({
                    signInError: "Information is incorrect"
                });
            }
            else if(err.request){
                console.log(err.request)
                this.setState({
                    signInError: "Information is incorrect"
                });
            }
            else{
                console.log("else" + err)
                //success 
                //take person sucess page
            }
        })
    
        //window.location = '/';//take person sucess page
    }


    render() {
        const {signInError} = this.state;
        return (
        <div>
          <h3>Sign In</h3>
          <div className ="error" style={{color: "red"}}>{signInError}</div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group"> 
              <label>Email: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.signInEmail}
                  onChange={this.onTextboxChangeSignInEmail}
                    />
            </div>
            <div className="form-group">
              <label>Password: </label>
              <input 
                  type="text" 
                  required
                  className="form-control"
                  value={this.state.signInPassword}
                  onChange={this.onTextboxChangeSignInPassword}
                  />
            </div>
    
            <div className="form-group">
              <input type="submit" value="Sign In" className="btn btn-primary" />
            </div>
            
          </form>
        </div>
        )
      }
}
