import React from 'react'
import Sidebar from './Sidebar/Sidebar'
import Footer from './Footer/Footer'
import Dashboard from './Dashboard/Dashboard'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Page404 from './Page404/Page404'
import Members from './Members/Members';

export default function App() {
  return (
    <Router>
      <div id="wrapper">
        <Sidebar/>
        <div id="content-wrapper" class="d-flex flex-column">
          <div id="content">
            <Switch>
              <Route path="/" exact component={Dashboard}/>
              <Route path="/mpc/members" component={Members}/>
              <Route component={Page404}/>
            </Switch>
          </div>
          <Footer/>
        </div>
      </div>
    </Router>
  )
}