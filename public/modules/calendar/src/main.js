import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import renderRoutes from './components/routes';

browserHistory.push('/view');
render(
  renderRoutes(),
  document.querySelector('#render-target')
);
