import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import ExtendData from './Components/ExtendData';
import RestorP from './Components/RestorP';
import Init from './Components/Init';
import Signin from './Components/Signin/';
import Signup from './Components/Signup/';
import Welcome from './Components/Welcome/';
import Logout from './Components/Logout/Logout.jsx';
import WalidateMail from './Components/WalidateMail';
import PassRestor from './Components/PassRestor';


ReactDOM.render(

<BrowserRouter>
    <div>
        <Route exact path='/' component={Welcome}/>
        <Route exact path='/extendreg' component={ExtendData}/>
        <Route exact path='/logout' component={Logout}/>
        <Route exact path='/signin' component={Signin}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path='/gen' component={Init}/>
        <Route exact path='/restor' component={PassRestor}/>
        <Route exact path='/repair' component={RestorP}/>
        <Route exact path='/valid' component={WalidateMail}/>
    </div>
</BrowserRouter>

, document.getElementById('root'));


registerServiceWorker();
