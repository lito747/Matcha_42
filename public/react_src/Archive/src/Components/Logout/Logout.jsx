import React from 'react'
import AuthService from '../Auth/AuthService'

class Logout extends React.Component{
	constructor(props) {
		super(props);

		this.Auth = new AuthService();
		this.escape_acc = this.escape_acc.bind(this);
	}

	escape_acc(){
		this.Auth.logout();
		this.props.history.replace('/');
		return false;
	}

	componentWillMount(){
		this.escape_acc();
	}

	render(){
		return false;
	}
}

export default Logout