import React from 'react';
import axios from 'axios';
var tmp_url = require('../../config/conf.jsx');

class Init extends React.Component {


	componentDidMount() {

		axios({
				url: 'https://randomuser.me/api/?results=500&nat=us,gb,fr',
  				responseType: 'json',
  			})
			.then(response => {
				axios({
            		url: tmp_url.api_url + '/users/generate',

            		method: 'post',

            		headers: {
                		'Content-Type': 'application/json',
            		},

            		data: response.data,

            		responseType: 'json',

        		}).then(response => {

        		}).catch(errors => {

        		});
			});
	}

	render() {

		return(null
			);
	}
}

export default Init;