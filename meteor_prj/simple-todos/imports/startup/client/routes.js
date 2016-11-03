import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
//import AppContainer from '../../ui/App.jsx';
import StartPage from '../../ui/start_page.jsx';
import Todos from '../../ui/ui_todos/App.jsx';
import App2 from '../../ui/ui_app2/App2.jsx';
//import ListPageContainer from '../../ui/containers/ListPageContainer.js';
//import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.js';
//import AuthPageJoin from '../../ui/pages/AuthPageJoin.js';
//import NotFoundPage from '../../ui/pages/NotFoundPage.js';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={StartPage}/>
    <Route path="/todos" component={Todos}/>
    <Route path="/app2" component={App2}/>
  </Router>
);