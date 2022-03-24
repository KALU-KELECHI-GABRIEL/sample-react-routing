import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch as Routes,
} from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import Report from './components/Report.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute';
// import PageNotFound from './components/PageNotFound'
// import './handleError.css'

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          {/* <Route exact path="/" component={Login} /> */}
          <Route exact path="/login" component={Login} />
          {/* <Route exact path="/" component={Login} /> */}
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/reports" component={Report} />
          <Route exact path="/logout" component={Logout} />
          {/* <Route exact path="*" component={PageNotFound} />  */}
        </Routes>
      </Router>
    );
  }
}

export default App;
