import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import renderRoutes from './components/routes';

import './helpers/filepicker';

render(
  renderRoutes(),
  document.querySelector('#render-target')
);

browserHistory.push('/folder');
