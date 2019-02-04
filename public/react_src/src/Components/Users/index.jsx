import React from 'react';
import axios from 'axios';

import {Row,  Input, Chip, CollapsibleItem, Collapsible}  from 'react-materialize';
import AuthService from '../Auth/AuthService';
var tmp_url = require('../../config/conf.jsx');


const style = {
  width: '25%',
  height: '25%',
  marginLeft: '10%'
}

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	user: [],
        	HistoryWisits: [],
        	HistoryWisitors: [],
        	HistoryMylike: [],
        	HistorySomlike: []
        };
        this.Auth = new AuthService();
    }

    componentDidMount() {
    	this.prot = true;
    	let tmp = this.Auth.getToken();
        axios({
            url: tmp_url.api_url + /users/ + tmp,

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'json', 

        }).then(response => {
        	if(this.prot) {
            	this.setState({
            		user: response.data
            	});
        	}
        	const data = new FormData();
            data.append('token', tmp);
            axios({
            url: tmp_url.api_url + '/history/ofVisits',

            method: 'post', 

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json', 

        }).then(response => {

        	if(this.prot) {
            	this.setState({
            		HistoryWisits: response.data
            	});
        	}
        	const data1 = new FormData();
            data1.append('token', tmp);
        	axios({
            url: tmp_url.api_url + '/history/visitors',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

           	data: data1,
            responseType: 'json', 

        }).then(response => {
        	if(this.prot) {
            	this.setState({
            		HistoryWisitors: response.data
            	});
        	}
        	const data2 = new FormData();
            data2.append( 'sourceToken', tmp);
            axios({
            url: tmp_url.api_url + '/like/check',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

           	data: data2,
            responseType: 'json', 

        }).then(response => {

        	if(this.prot) {
            	this.setState({
            		HistoryMylike: response.data
            	});
        	}
        	const data3 = new FormData();
            data3.append('token', tmp);
            axios({
            url: tmp_url.api_url + '/like/likedBy',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

           	data: data3,
            responseType: 'json', 

        }).then(response => {

        	if(this.prot) {
            	this.setState({
            		HistorySomlike: response.data
            	});
        	}
        });
        });
        });
        });
        });

    }

    componentWillUnmount() {
    	this.prot = false;
    }

    myfunc = () => {
        if (this.state.user.Tags) {
            return (this.state.user.Tags.map(function(element, i){
              return <Chip key={element.tag}>{element.tag}</Chip>;
            }));
        }
        return null;
    }

    myphoto = () => {
        let tmp2 = [];
        if(this.state.user.photos) {
            for (let i = 0; i < this.state.user.photos.length; i++) {
                if(this.state.user.photos[i].url.search('https://')) {
                  tmp2.push(tmp_url.api_url + '/' + this.state.user.photos[i].url);
                } else {
                  tmp2.push(this.state.user.photos[i].url);
                }
            }
            return (tmp2.map(function(elem) {
                  return <img key={elem} src={elem} alt='' style={style}/>;
                }));
        }
        return null;
    }

    ifHistoryWisits = () => {
        let tmp = [];
        if (this.state.HistoryWisits.history) {
            tmp = this.state.HistoryWisits.history;

            return(<div>
                    <Collapsible s={8}>
                        <CollapsibleItem header='MyVisits' icon='filter_drama'>
                        {tmp.map(function(elem, i) {
                            return <p key={i}>{elem.viewedDate}  {elem.FirstName} {elem.LastName}</p>;})}
                        </CollapsibleItem>
                    </Collapsible>
                    </div>
            );
        }
        return null;
    }

    ifHistoryWisior = () => {
        let tmp = [];
        if (this.state.HistoryWisitors.history) {
            tmp = this.state.HistoryWisitors.history;
            return(<div>
                    <Collapsible s={8}>
                        <CollapsibleItem header='MyVisitors' icon='filter_drama'>
                        {tmp.map(function(elem, i) {
                            return <p key={i}>{elem.viewedDate}  {elem.FirstName} {elem.LastName}</p>;})}
                        </CollapsibleItem>
                    </Collapsible>
                    </div>
            );
        }
        return null;
    }

    ifHistoryLikes = () => {
        let tmp = [];
        if (this.state.HistoryMylike.info) {
            tmp = this.state.HistoryMylike.info;
            return(<div>
                    <Collapsible s={8}>
                        <CollapsibleItem header='MyLikes' icon='filter_drama'>
                        {tmp.map(function(elem, i) {
              
                            return <p key={i}>I liked {elem.Name} </p>;})}
                        </CollapsibleItem>
                    </Collapsible>
                    </div>
            );
        }
        return null;
    }

    ifHistoryLikesMi = () => {
        let tmp = [];
        if (this.state.HistorySomlike.info) {
            tmp = this.state.HistorySomlike.info;
            return(<div>
                    <Collapsible s={8}>
                        <CollapsibleItem header='I Liked By' icon='filter_drama'>
                        {tmp.map(function(elem, i) {
              
                            return <p key={i}> Liked me {elem.Name} </p>;})}
                        </CollapsibleItem>
                    </Collapsible>
                    </div>
            );
        }
        return null;
    }


    render() {

        let tmp = this.state.user.LastName + ' ' + this.state.user.FirstName; 
    
    	return(
    	<div >
    	<div className="container" >
         <Row>
            <div>
            <h3>{tmp}</h3>
            {this.myphoto()}
            {this.ifHistoryWisits()}
            {this.ifHistoryWisior()}
            {this.ifHistoryLikes()}
            {this.ifHistoryLikesMi()}

            </div>
            <h4>Preferences:</h4>
            <Input  type="textarea"  value={this.state.user.Preference} disabled s={12}/>
            <h4>Tags:</h4>
            {this.myfunc()}
            <h4>Popularity:</h4>
            <Input  type="textarea" value={this.state.user.Popularity} disabled s={12}/>
            <h4>City:</h4>
            <Input  type="textarea" value={this.state.user.City} disabled s={12}/>
            <h4>Country:</h4>
            <Input  type="textarea" value={this.state.user.Country} disabled s={12}/>
            <h4>Age:</h4>
            <Input  type="textarea" value={this.state.user.Age} disabled s={12}/>
            <h4>Biography:</h4>
            <Input type="textarea" value={this.state.user.Bio} disabled s={12}/>
            <h4>Gender:</h4>
            <Input type="textarea" value={this.state.user.Gender} disabled s={12}/>
            <h4>Orientation:</h4>
            <Input type="textarea" value={this.state.user.Orientation} disabled s={12}/>
             </Row>
        </div>

      	</div>
        );
    }
}

export default Users