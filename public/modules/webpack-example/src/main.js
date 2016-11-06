import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import renderRoutes from './components/routes';

render(
  renderRoutes(),
  document.getElementById('render-target')
);

browserHistory.push('/');