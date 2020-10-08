import React, {Component } from 'react';

//verify user make sure they aren't already logged in or already have a quest account


export default class CreateGuestAccount extends Component {

    createGuestAccount(){
        console.log("Guest Account Created");
    }

    render() {
        return (
            <div>
                <h3>If you are sure you want to make a guest account click below!</h3>
                <h3>Guest account will be automatically deleted once logged out along with all data</h3>
                <div>
                    <button onClick={() => this.createGuestAccount()}>Create Guest Account</button>
                </div>
            </div>

        )
    }
}