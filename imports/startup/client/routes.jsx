import { analytics }     from 'meteor/okgrow:analytics'; // Package for analytics
import React             from 'react';
import {
  Router,
  Route,
  IndexRoute,
  Redirect,
  browserHistory,
}                        from 'react-router';

import { TEAMS }         from '../../api/teams/teams';

// Route components
import AppPageContainer  from '../../ui/app/AppPageContainer';
import TeamPageContainer from '../../ui/team/TeamPageContainer';
import LandingPage       from '../../ui/landing/LandingPage';
import NotFound          from '../../ui/not-found/NotFoundPage';

// Override accounts templates
import '../../ui/accounts/accounts-templates';

const logPageView = (nextState) => {
  analytics.page(nextState.location.pathname);
};

const renderRoutes = () => {
  let getRoutes = () => {
    return TEAMS.map(team => team.url).map((route) => {
      return (
        <Route key={route} path={route} component={AppPageContainer} onEnter={logPageView}>
          <IndexRoute component={LandingPage} />
          <Route path="/team/:teamUrl" component={TeamPageContainer} onEnter={logPageView} />
          <Route path="*" component={NotFound} onEnter={logPageView} />
        </Route>
      );
    });
  };
  
  console.log(getRoutes());

  let expected = (
    <Router history={browserHistory}>
      <Redirect from="/" to="carlosydario" />
      {getRoutes()}
      <Route path="*" component={NotFound} onEnter={logPageView} />
    </Router>
  );

  return expected;
};

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
