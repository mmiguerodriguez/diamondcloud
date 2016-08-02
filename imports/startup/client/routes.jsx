import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// Route components
import App       from '../../ui/app/AppContainer.jsx';
import Landing   from '../../ui/landing/LandingPage.jsx';
import Dashboard from '../../ui/dashboard/DashboardPage.jsx';
import Team      from '../../ui/team/TeamPage.jsx';
import Pricing   from '../../ui/pricing/PricingPage.jsx';
import Help      from '../../ui/help/HelpPage.jsx';
import About     from '../../ui/about-us/AboutPage.jsx';

export const renderRoutes = () => (
  <Router history={ browserHistory }>
    <Route path="/" component={ App }>
      <IndexRoute component={ Landing }/>
      <Route path="/dashboard" component={ Dashboard } />
      <Route path="/team/:teamId" component={ Team } />
      <Route path="/pricing" component={ Pricing } />
      <Route path="/help" component={ Help } />
      <Route path="/about" component={ About } />
    </Route>
  </Router>
);
