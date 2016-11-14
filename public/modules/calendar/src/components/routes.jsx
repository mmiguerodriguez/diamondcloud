import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Calendar from './calendar/Calendar';
import ViewPage from './view/ViewPage';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Calendar}>
      <Route path="/view" component={ViewPage} />
    </Route>
  </Router>
);

export default renderRoutes;
