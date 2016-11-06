import { Router, Route, browserHistory } from 'react-router';
import App from './App';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>
);

export default renderRoutes;
