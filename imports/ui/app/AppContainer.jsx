import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import AppPage             from './AppPage';

const AppContainer = createContainer(() => {
  const user = Meteor.user();
  return {
    user,
  };
}, AppPage);

export default AppContainer;
