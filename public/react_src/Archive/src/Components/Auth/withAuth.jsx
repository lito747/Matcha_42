import React, { Component } from 'react';
import AuthService from './AuthService';
var tmp_url = require('../../config/conf.jsx');

export default function withAuth(AuthComponent) {

    const Auth = new AuthService(tmp_url.api_url);
    return class AuthWrapped extends Component {
        
        constructor() {
            super();
            this.state = {
                user: null
            }
        }

        componentWillMount() {
            if (!Auth.loggedIn()) {
                if (parseInt(Auth.isReg()) === 0) {
                    this.props.history.replace('/extendreg');
                 }
                this.props.history.replace('/interlinc');
            } else {
                try {
                    if(Auth.loggedIn()) {
                        this.setState({
                            user: 1
                        });
                    }
                }
                catch(err){
                  //  Auth.logout();
                   // this.props.history.replace('/interlinc');
                }
            }
        }

        render() {
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} />
                )
            }
            else {
                return null
            }
        }
    };
}
