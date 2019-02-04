import React from "react"
import {Button, Icon} from 'react-materialize'

class Interlinc extends React.Component{

	constructor(props) {
        super(props);
        this.signinRedirect = this.signinRedirect.bind(this);
        this.signupRedirect = this.signupRedirect.bind(this);
    }

	signinRedirect() {
		this.props.history.replace('/signin');
	}

	signupRedirect() {
		this.props.history.replace('/signup');
	}

	render() {
    	return(
    			<div className="container">
    				<Button waves='light'   onClick={this.signinRedirect}>Signin<Icon right>send</Icon></Button>
    				<Button waves='light'   onClick={this.signupRedirect}>Signup<Icon right>send</Icon></Button>
    			</div>
    		);
    }
}

export default Interlinc;