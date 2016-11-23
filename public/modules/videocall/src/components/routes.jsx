import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import VideoChatPage from './videochat/VideoChatPage';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={VideoChatPage}>
      <IndexRoute component={VideoChatPage} />
    </Route>
  </Router>
);

export default renderRoutes;
