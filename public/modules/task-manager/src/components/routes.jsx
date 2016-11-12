import { Router, Route, browserHistory } from 'react-router';

import TaskManagerPage        from './task-manager/TaskManagerPage';
import BoardsList             from './boards/BoardsList';
import CreateTaskLayout       from './create-task/CreateTaskLayout';
import ArchivedTasksPage      from './archived-tasks/ArchivedTasksPage';
import TaskInformationLayout  from './task-information/TaskInformationLayout';
import BoardInformationLayout from './board-information/BoardInformationLayout';
import Panel                  from './panel/Panel';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={TaskManagerPage}>
      <Route path="/tasks/show" component={BoardsList} />
      <Route path="/tasks/create" component={CreateTaskLayout} />
      <Route path="/tasks/archived" component={ArchivedTasksPage} />
      <Route path="/tasks/:taskId" component={TaskInformationLayout} />

      <Route path="/board/:boardId" component={BoardInformationLayout} />

      <Route path="/panel" component={Panel} />
    </Route>
  </Router>
);

export default renderRoutes;
