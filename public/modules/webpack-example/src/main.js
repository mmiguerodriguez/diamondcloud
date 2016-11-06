import './main.css';

import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import renderRoutes from './components/routes';

render(
  renderRoutes(),
  document.querySelector('#render-target')
);

if (module.hot) {
  module.hot.accept('./components/routes', () => {
    const renderRoutes = require('./components/routes').default;
    render(
      renderRoutes(),
      document.querySelector("#render-target")
    );
  });
}

browserHistory.push('/');