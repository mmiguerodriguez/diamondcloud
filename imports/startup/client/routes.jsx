import { analytics }     from 'meteor/okgrow:analytics'; // Package for analytics
import React             from 'react';
import {
  Router,
  Route,
  IndexRoute,
  Redirect,
  browserHistory,
}                        from 'react-router';

// Route components
import AppContainer      from '../../ui/app/AppContainer';
import TeamContainer     from '../../ui/team/TeamContainer';
import LandingPage       from '../../ui/landing/LandingPage';
import NotFound          from '../../ui/not-found/NotFoundPage';

// Override accounts templates
import '../../ui/accounts/accounts-templates';

const logPageView = (nextState) => {
  analytics.page(nextState.location.pathname);
};

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Redirect from="/" to="carlosydario" />
    <Route path="/:teamUrl" component={AppContainer} onEnter={logPageView}>
      <IndexRoute component={LandingPage} />
      <Route path="/team/:teamUrl" component={TeamContainer} onEnter={logPageView} />
      <Route path="*" component={NotFound} onEnter={logPageView} />
    </Route>
    <Route path="*" component={NotFound} onEnter={logPageView} />
  </Router>
);

export default renderRoutes;

/*
  import Dashboard from '../../ui/dashboard/DashboardPage.jsx';
  import Pricing   from '../../ui/pricing/PricingPage.jsx';
  import Help      from '../../ui/help/HelpPage.jsx';
  import About     from '../../ui/about-us/AboutPage.jsx';
  <Route path="/dashboard" component={Dashboard} />
  <Route path="/pricing" component={Pricing} />
  <Route path="/help" component={Help} />
  <Route path="/about" component={About} />
*/
