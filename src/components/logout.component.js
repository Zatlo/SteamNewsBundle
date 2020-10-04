import React, {Component } from 'react';
//import {Link} from 'react-router-dom';
import axios from 'axios';

import {
    setInStorage,
    getFromStorage
} from '../utils/storage';



export default class SignIn extends Component{

    constructor(props) {
        super(props);
        
        this.state = {//state is how to use variables?
            message: '',
            token: ''
        }
    }


    componentDidMount() {
          const obj = getFromStorage('steam-news-bundles');
          if (obj && obj.token) {
            const { token } = obj;
            // Verify token
            axios.get('/users/account/logout?token=' + token)
              .then(res => {
                if (res.data.success) {
                  this.setState({
                    token: '',
                    message: res.data.message
                  });
                  setInStorage('steam-news-bundles',);
                } else {
                    console.log('Hm')
                  this.setState({
                    message: res.data.message,
                  });
                }
              })
              .catch(err =>{
                console.log('Already logged out!')
              })
        } 
        else {
            this.setState({
            });
            console.log('Already logged out')
        }
    }
    


    render() {
        return (
            <div>
                <h3>{this.state.message}</h3>
            </div>


        )

    }
}