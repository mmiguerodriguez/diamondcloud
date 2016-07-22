import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Route components
import App       from '../../ui/app/AppContainer.jsx';
import Dashboard from '../../ui/dashboard/DashboardPage.jsx';

export const renderRoutes = () => (
  <Router history={ browserHistory }>
    <Route path="/" component={ App }>
      <Route path="/dashboard" component={ Dashboard } />
    </Route>
  </Router>
);