import React from 'react';

import Task from './task/Task';

/**
 * Renders the task list from a board.
 */
class TasksList extends React.Component {
  renderTasks() {
    if (this.props.tasks.length === 0) {
      if (this.props.location.pathname.indexOf('archived') > -1) {
        return (
          <div className='text-center no-task'>No hay tareas archivadas</div>
        );
      }

      return (
        <div className='text-center no-task'>No hay tareas asignadas a este pizarrón</div>
      );
    }

    return this.props.tasks.map((task) => {
      let doing = false;

      task.durations.forEach((duration) => {
        if (duration.userId === this.props.currentUser._id) {
          if (!duration.endTime) {
            doing = true;
          }
        }
      });

      return (
        <Task
          key={task._id}
          task={task}
          doing={doing}
          board={this.props.board}
          coordination={this.props.coordination}
          currentUser={this.props.currentUser}
          showError={this.props.showError}
          hideError={this.props.hideError}
        />
      );
    });
  }

  handleKeyDown(event) {
    if (event.which === 13) {
      this.props.setLocation('tasks/create');
    }
  }

  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    const self = this;

    $('.tasks-list').droppable({
      accept: '.task',
      drop: function (event, ui) {
        const $board = $(this);
        const $drag = $(ui.draggable);
        const taskId = $drag.data('task-id');
        const taskBoardId = $drag.data('task-board-id');
        const boardId = $board.data('board-id');

        if (taskBoardId === boardId) {
          return;
        }

        DiamondAPI.update({
          collection: 'tasks',
          filter: {
            _id: taskId,
          },
          updateQuery: {
            $set: {
              boardId,
              status: 'queued',
              rejectMessage: '',
            },
          },
          callback(error, result) {
            if (error) {
              self.props.showError({
                body: 'Hubo un error al cambiar la tarea de pizarrón',
              });
            }
          }
        });
      },
    });
  }

  render() {
    const hasTasks = this.props.tasks.filter(_task =>
      _task.boardId === this.props.board._id && !_task.archived && (_task.status !== 'rejected')
    ).length > 0;

    return (
      <div className='col-xs-12 tasks-list' data-board-id={this.props.board._id}>
        <div>
          <p className='text-center'>
            <b>{this.props.board.name}</b>
            {
              this.props.coordination && !this.props.archivedView && hasTasks ? (
                <img
                  src="/modules/task-manager/img/timeline.svg"
                  id={`timeline-btn${this.props.board._id}`}
                  className="timeline-btn"
                  title="Ver línea de tiempo del pizarrón"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  role="button"
                  onClick={(e) => {
                    $(`#${e.target.id}`).tooltip('hide');
                    this.props.setLocation(`/board/${this.props.board._id}`);
                  }}
                  />
              ) : (null)
            }
          </p>
        </div>
        {this.renderTasks()}
        {
          this.props.coordination && !this.props.archivedView ? (
            <div className="form-group">
              <input
                id="task_title"
                className="form-control"
                onChange={this.props.handleChange.bind(null, 'taskTitle', this.props.board._id)}
                onKeyDown={this.handleKeyDown}
                placeholder="Agregue una nueva tarea"
                type="text"
              />
            </div>
          ) : (null)
        }
      </div>
    );
  }
}

export default TasksList;
