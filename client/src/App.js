import React, { Fragment }from 'react';
import {BrowserRouter as Router, Route ,Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';

//redux 
import { Provider} from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store = {store}>
    <Router>
      <Fragment>
        <Navbar className></Navbar>
          <Route exact path = '/' component = {Landing} />
          <section className = "container">
            <Alert></Alert>
            <Switch>
              <Route exact path = '/login' component = {Login} />
            </Switch>
            <Switch>
               <Route exact path = '/register' component = {Register} />
            </Switch>          
          </section>
    </Fragment>     
    </Router>
    </Provider> 
  );
}

export default App;
