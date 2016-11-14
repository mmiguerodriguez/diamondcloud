import { Router, Route, browserHistory } from 'react-router';

import Index from './index/Index';
import FileManagerPage from './file-manager/FileManagerPage';
import FileViewerPage from './file-viewer/FileViewerPage';
import PresentationPage from './presentation-page/PresentationPage';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path='/' component={Index}>
      <Route path='/folder' component={FileManagerPage} />
      <Route path='/folder/:folderId' component={FileManagerPage} />
      <Route path='/document/:documentId' component={FileViewerPage} />
      <Route path='/presentation/:id' component={PresentationPage} />
    </Route>
  </Router>
);

export default renderRoutes;
