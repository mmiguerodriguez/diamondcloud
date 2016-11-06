import { render } from 'react-dom';
import renderRoutes from './components/routes.jsx';

render(
  renderRoutes(),
  document.getElementById('render-target')
);