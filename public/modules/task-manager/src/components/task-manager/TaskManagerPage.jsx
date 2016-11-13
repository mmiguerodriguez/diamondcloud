import React             from 'react';

import isCoordination    from '../helpers/isCoordination';
import TaskManagerLayout from './TaskManagerLayout';

/**
 * Grabs all the data needed for the component to work
 * and passes it to the layout.
 */
class TaskManagerPage extends React.Component {
  constructor() {
    super();

    /**
     * States
     *
     * @param {Array} tasks
     *  All the tasks we need to show
     *  to the user.
     * @param {Object} currentBoard
     *  Current board object.
     * @param {Object} currentUser
     *  Current user object.
     * @param {Boolean} coordination
     *  A bool that says if the actual
     *  board is or not a
     *  coordination
     *  board.
     * @param {Boolean} loading
     *  A bool to check if the subscription
     *  is loading.
     * @param {Array} users
     *  An array of the team users.
     * @param {Array} boards
     *  An array of the team boards.
     */
    this.state = {
      tasks: [],
      currentBoard: {},
      currentUser: {},
      coordination: false,
      loading: true,
      users: [],
      boards: [],
    };
  }

  componentDidMount() {
    const self = this;

    $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
    });

    const currentBoard = DiamondAPI.getCurrentBoard();
    const currentUser = DiamondAPI.getCurrentUser();
    let coordination = isCoordination(currentBoard);

    /**
     * Set currentBoard, user and if it's a
     * coordination board type, a boolean.
     */
    self.setState({
      currentBoard,
      currentUser,
      coordination,
    }, () => {
      /**
       * If it's a cordination board type then fetch all tasks,
       * even finished ones, except archived.
       * If not, fetch the ones that are from the
       * currentBoard and that are not finished
       * or queued.
       */
      const filter = coordination ? { } : {
        archived: false,
        status: {
          $in: [
            'queued',
            'not_finished',
          ],
        },
        boardId: currentBoard._id,
      };

      /**
       * After grabbing all the data we needed, subscribe
       * to the tasks collection with the filter, and
       * setting the state on the callback.
       */
      const taskManagerHandle = DiamondAPI.subscribe({
        collection: 'tasks',
        filter,
        callback(error, _result) {
          if (error) {
            console.error(error);
          } else {
            let result = _result;

            result.sort((a, b) => {
              return new Date(a.startDate) - new Date(b.startDate);
            });

            self.setState({
              tasks: result || [],
              loading: false,
            });
          }
        },
      });

      self.setState({
        boards: DiamondAPI.getBoards().fetch(),
        users: DiamondAPI.getUsers(),
      });
    });
  }

  render() {
    if (this.state.loading || this.state.loading === undefined) {
      return (
        <div className="loading">
          <div className="loader" />
        </div>
      );
    }

    return (
      <TaskManagerLayout {...this.state} {...this.props} />
    );
  }
}

export default TaskManagerPage;
