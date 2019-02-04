import React from 'react';
import axios from 'axios';

var tmp_url = require('../../config/conf.jsx');


class WalidateMail extends React.Component {

	componentDidMount() {

		if (this.props.location.search) {
		let tmp = this.props.location.search.split('=');
		const data = new FormData();
		data.append('token', tmp[1]);

		axios({
            url: tmp_url.api_url + '/signup/verify',

            method: 'post',

            headers: {
                'Content-Type': 'multipart/form-data',
            },

            data: data,

            responseType: 'json',

        }).then(response => {

            this.props.history.replace('/');
        }).catch(error => {});
  	}
	}
	render() {
		return null;
	}


}

export default WalidateMail