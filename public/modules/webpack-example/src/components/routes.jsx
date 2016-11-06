import { Router, Route, browserHistory } from 'react-router';
import App from './App';

/**
 * Router setup.
 */
const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById('render-target')
);

export default renderRoutes;
