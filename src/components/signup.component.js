import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';

import {
    getFromStorage
} from '../utils/storage';

export default class SignUp extends Component{ ////need to always call super when calling constructor of subclass

    constructor(props) {
        super(props);
    
        this.onTextboxChangeSignUpUsername = this.onTextboxChangeSignUpUsername.bind(this);
        this.onTextboxChangeSignUpEmail  = this.onTextboxChangeSignUpEmail.bind(this);
        this.onTextboxChangeSignUpPassword  = this.onTextboxChangeSignUpPassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {//state is how to use variables?
            signUpUsername: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpError: ''
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



    onTextboxChangeSignUpUsername(e) {
        this.setState({
            signUpUsername: e.target.value//target is textbox
        });
    }
    
    onTextboxChangeSignUpEmail(e) {//target is textbox
        this.setState({
            signUpEmail: e.target.value
        })
    }
    
    onTextboxChangeSignUpPassword(e) {//target is textbox
        this.setState({
            signUpPassword: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();//prevents default html form submit behavior from taking place
    
        const user = {
            username: this.state.signUpUsername,
            email: this.state.signUpEmail,
            password: this.state.signUpPassword,
        }
    
        console.log(user);
    
        axios.post('/users/account/signup', user)//sends data to backend
        .then(res => {
            window.location = '/users/signin';
        })
        .catch(err => {
            if(err.response){
                console.log(err.response)
                this.setState({
                    signUpError: err.response.data.message
                });
            }
            else if(err.request){
                console.log(err.request)
                this.setState({
                    signUpError: err.response.data.message
                });
            }
            else{
                console.log("worked")
                //success 
                //window.location = '/';//take person sucess page
            }
        })
    
        //window.location = '/';//take person sucess page
    }


    render() {
        const {signUpError} = this.state;
        return (
        <div>
          <h3>Create New User</h3>
          <div className ="error" style={{color: "red"}}>{signUpError}</div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group"> 
              <label>Username: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.signUpUsername}
                  onChange={this.onTextboxChangeSignUpUsername}
                    />
            </div>
            <div className="form-group"> 
              <label>Email: </label>
              <input  type="text"
                  required
                  className="form-control"
                  value={this.state.signUpEmail}
                  onChange={this.onTextboxChangeSignUpEmail}
                  />
            </div>
            <div className="form-group">
              <label>Password: </label>
              <input 
                  type="text" 
                  required
                  className="form-control"
                  value={this.state.signUpPassword}
                  onChange={this.onTextboxChangeSignUpPassword}
                  />
            </div>
    
            <div className="form-group">
              <input type="submit" value="Create New User" className="btn btn-primary" />
            </div>
            
          </form>
        </div>
        )
      }
}
