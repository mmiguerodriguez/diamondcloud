import FileManagerLayout     from './FileManagerLayout.jsx';

export default class FileManagerPage extends React.Component {
  renderFolders() {

  }

  render() {
    return (
      <FileManagerLayout folders={ this.props.folders } documents={ this.props.documents } />
    );
  }
}

export default FileManagerPageContainer = createContainer(() => {
  const teamsHandle = Meteor.subscribe('teams.dashboard');
  const loading = !teamsHandle.ready();
  return {
    loading,
    teams: Teams.find({}, { sort: { name: -1 } }).fetch(),
  };
}, Dashboard);
