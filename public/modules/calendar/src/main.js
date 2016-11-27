import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import renderRoutes from './components/routes';
import './components/helpers/react-popover';

render(
  renderRoutes(),
  document.querySelector('#render-target')
);

browserHistory.push('/view');
