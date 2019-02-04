import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import ExtendData from './Components/ExtendData'


import Signin from './Components/Signin/';
import Signup from './Components/Signup/';
import Users from './Components/Users/';
import Profile from './Components/Profile/';
import Forum from './Components/Forum/';
import ForumTopic from './Components/Forum/ForumTopic';
import NavbarMy from './Components/Navbar/';
import Welcome from './Components/Welcome/';
import Logout from './Components/Logout/Logout.jsx';
import Interlinc from './Components/Interlinc/Interlinc.jsx';
import MyMap from './Components/MyMap'



ReactDOM.render(
<BrowserRouter>
    <div>
        <Route exact path='/' component={Welcome}/>
        <Route exact path='/interlinc' component={Interlinc}/>
        <Route exact path='/extendreg' component={ExtendData}/>
        <Route exact path='/logout' component={Logout}/>
        <Route exact path='/signin' component={Signin}/>
        <Route exact path='/signup' component={Signup}/>
    </div>
</BrowserRouter>
, document.getElementById('root'));


registerServiceWorker();

