import React from 'react';

import UserTaskInformation from './user-task-information/UserTaskInformation';

/**
 * Renders information from the task.
 */
class TaskInformationLayout extends React.Component {
  render() {
    let task;
    let board;
    let status;

    task = this.props.tasks.find(_task => _task._id === this.props.params.taskId);
    board = this.props.boards.find(_board => _board._id === task.boardId);

    if (task.status === 'finished') {
      status = 'Finalizada';
    } else if (task.status === 'not_finished') {
      status = 'No finalizada';
    } else if (task.status === 'queued') {
      status = 'En espera';
    } else if (task.status === 'rejected') {
      status = 'Rechazada';
    }

    return (
      <div>
        <div
          className='go-back go-back-task'
          onClick={(task.archived) ?
            () => this.props.setLocation('tasks/archived') :
            () => this.props.setLocation('tasks/show')
          } />
        <div className='task-info col-xs-12'>
          <h4 className='task-info-title'>Información de la tarea</h4>
          <div className='item'>
            <p>
              <b>Tarea:</b> {task.title}
            </p>
            <p>
              <b>Descripción:</b> {task.description}
            </p>
            <p>
              <b>Pizarrón:</b> {board.name}
            </p>
            <p>
              <b>Plazo:</b>
              {` ${$.format.date(new Date(task.startDate), 'dd/MM/yy')} - ${$.format.date(new Date(task.dueDate), 'dd/MM/yy')}`}
            </p>
            <p>
              <b>Estado:</b> {status}
            </p>
            <UserTaskInformation
              durations={task.durations}
              users={this.props.users}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TaskInformationLayout;
