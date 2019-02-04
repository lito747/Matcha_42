import React from 'react'
import axios from 'axios'
import {Input, Button, Icon} from 'react-materialize'
var tmp_url = require('../../config/conf.jsx');

class ForumTopic extends React.Component{
    constructor(props)
    {
        super(props);
        this.state = {
            numOfTopics: '',
            topics: '',
            id: this.props.match.params.id
        };
        this.findTopic = this.findTopic.bind(this);
    }

    findTopic() {
        var data = new FormData();
        axios({
            url: tmp_url.api_url+this.state.id,

            method: 'post', // default

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json', // default

        }).then(response => {
            // console.log("done");
            console.log(response);
            // this.setState({topics: response.data});
            // console.log(this.state.topics);
        }).catch(errors => {
            alert(errors)
        });

    }

    render() {
        this.findTopic();
        return(
           <div>
               <p>{this.state.id}</p>
           </div>
        );
    };
}

export default ForumTopic