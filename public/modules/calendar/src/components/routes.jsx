import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Calendar from './calendar/Calendar';
import SetupPage from './setup/SetupPage';
import ViewPage from './view/ViewPage';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/view" component={ViewPage} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/setup" component={SetupPage} >
    </Route>
  </Router>
);

export default renderRoutes;
