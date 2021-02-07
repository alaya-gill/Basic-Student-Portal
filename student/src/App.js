import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import NavBar from './components/NavBar'
import Landing from './components/Landing'
import Example from './components/Example'
import AddCourse from './components/addCourse'
import GPA from './components/Gpa'
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 3000,
  position: positions.TOP_CENTER
};
class App extends Component {
  
  render () {
    return (
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Landing} />
          <div className="container">
          <Provider template={AlertTemplate} {...options}>
              <Route exact path="/students" component={Example} />
          </Provider>
          </div>
          <div className="container">
          <Provider template={AlertTemplate} {...options}>
            <Route exact path="/addCourse" component={AddCourse} />
          </Provider>
          </div>
          <div className="container">
          <Provider template={AlertTemplate} {...options}>
            <Route exact path="/gpa" component={GPA} />
          </Provider>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
