import React from 'react'
import axios from 'axios'
import {Input, Button, Icon} from 'react-materialize'

class Forum extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            numOfTopics: '',
            topics: ''
        };
        this.getTopics = this.getTopics.bind(this);
    }

    getTopics() {
        var data = new FormData();
        axios({
            url: 'http://localhost:8100/forum',

            method: 'post', // default

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json', // default

        }).then(response => {
            console.log("done");
            console.log(response);
            this.setState({topics: response.data});
            console.log(this.state.topics);
        }).catch(errors => {
            alert(errors)
        });

    }

    render() {
        // this.getTopics();
        return(
            <div className="container row col s6 offset-s3">
                <div className="col s6 offset-s3">
                    <h4 className="col s3 m4 offset-s2 offset-m4">Forum</h4>
                    {/*<Input type='text' label='Login' value={this.state.Login} onChange={this.handleLoginChange} s={12}/>*/}
                    {/*<Input type='text' label='Email' value={this.state.Email} onChange={this.handleEmailChange} s={12}/>*/}
                    {/*<Input type='password' label='Password' value={this.state.Password} onChange={this.handlePasswordChange} s={12}/>*/}
                    {/*<Input type='password' label='Password Confirm' value={this.state.PasswordConfirm} onChange={this.handlePasswordConfirmChange} s={12}/>*/}
                    <Button waves='light' className="col s8 m4 offset-s2 offset-m4" onClick={this.getTopics}>Go!<Icon right>send</Icon></Button>

                </div>
                <div>
                    <a className="btn-floating btn-large waves-effect waves-light red lighten-2"><i className="material-icons">add</i></a>
                </div>
            </div>
        );
    };
}

export default Forum