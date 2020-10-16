import React from 'react';
//import logo from './logo.svg';
//import './App.css';
import {BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


import Navbar from "./components/navbar.component";
import HomePage from "./components/home.component";
import CreateBundle from "./components/create-bundle.component";
import SignUp from "./components/signup.component";
import SignIn from "./components/signin.component";
import LogOut from "./components/logout.component";
import Games from "./components/bundles/games.component";
import GameNews from "./components/bundles/gamenews.component";
import CreateGuestAccount from "./components/createguestaccount.component";
import PublicBundle from "./components/public/public-bundle.component";



function App() {
  return (
    <Router>

      <div className="container">
        <Navbar />
        <p style={{textAlign: "center"}}>Website Updated Daily!</p>
        <br/>
        <Route path = "/" exact component={HomePage}/>
        <Route path = "/bundles" exact component={CreateBundle}/>
        <Route path = "/bundles/:bundlename" exact component={Games}/>
        <Route path = "/bundles/:bundlename/news" exact component={GameNews}/>



        
        <Route path = "/users/signup" exact component={SignUp}/>
        <Route path = "/users/signin" exact component={SignIn}/>
        <Route path = "/users/logout" exact component={LogOut}/>
        <Route path = "/users/createguestaccount" exact component={CreateGuestAccount}/>

        <Route path = "/public/bundle/:bundleid" exact component={PublicBundle}/>
      </div>
    </Router>
    
  );
}

export default App;
