import React from 'react';

/**
 * Renders information of tasks within a board
 */
class BoardInformationLayout extends React.Component {
  constructor(props) {
    super(props);

    const board = this.props.boards.find(_board => _board._id === this.props.params.boardId);
    const tasks = this.props.tasks.filter(_task =>
      _task.boardId === board._id && !_task.archived && (_task.status !== 'rejected')
    );

    this.state = {
      board,
      tasks,
    };
  }

  drawChart(data) {
    const container = this.timeline;
    const chart = new google.visualization.Timeline(container);
    const dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'Tarea' });
    dataTable.addColumn({ type: 'date', id: 'Inicio' });
    dataTable.addColumn({ type: 'date', id: 'Fin' });

    dataTable.addRows(data);
    chart.draw(dataTable);
  }

  componentDidMount() {
    const self = this;
    const data = [];

    this.state.tasks.forEach(task => {
      data.push([
        task.title,
        new Date(task.startDate),
        new Date(task.dueDate),
      ]);
    });

    if (this.state.tasks.length > 0) {
      this.drawChart(data);
      $(window).resize(self.drawChart.bind(this, data));
    }
  }

  componentWillUnmount() {
    $(window).off('resize');
  }

  render() {
    return (
      <div className="timeline-container">
        <div
          className="go-back go-back-task"
          onClick={() => this.props.setLocation('tasks/show')}
        />
        <div className="text-center">
          <b>{this.state.board.name}</b>
        </div>
        <div className="timeline" ref={c => this.timeline = c } />
        {
          this.state.tasks.length === 0 ? (
            <div>
              No hay tareas de las que mostrar informacion
            </div>
          ) : (null)
        }
      </div>
    );
  }
}

export default BoardInformationLayout;
