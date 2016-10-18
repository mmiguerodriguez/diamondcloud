import { Meteor }          from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import AppPage             from './AppPage';

const AppPageContainer = createContainer(() => {
  const user = Meteor.user();
  return {
    user,
  };
}, AppPage);

export default AppPageContainer;
