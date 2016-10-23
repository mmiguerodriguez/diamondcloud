import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Teams = new Mongo.Collection('Teams');

Teams.helpers({
  /**
   * Shows if the user has certain hierarchy in the given team
   * @param {String} email
   * @param {String} hierarchy
   * @returns {Boolean} isCertainHierarchy
   *
   * TODO: let hierarchy be an array of hierarchies
   */
  userHierarchy(email) {
    for (const user of this.users) {
      if (user.email === email) {
        return user.hierarchy;
      }
    }

    return 'ghost';
  },

  userIsCertainHierarchy(email, hierarchy) {
    for (let i = 0; i < this.users.length; i += 1) {
      if (email === this.users[i].email) {
        if (hierarchy === this.users[i].hierarchy) {
          return true;
        }

        return false;
      }
    }
    return false;
  },

  hasUser(user) {
    let mail;
    let found = false;

    if (typeof user === 'string') {
      if (/\S+@\S+\.\S+/.test(user)) { // email RegEx
        mail = user;
      } else {
        mail = Meteor.users.findOne(user).email();
      }
    } else if (user._id) {
      mail = Meteor.users.findOne(user._id).email();
    } else if (typeof user.email === 'string') {
      mail = user.email;
    }

    this.users.forEach((_user) => {
      if (_user.email === mail) {
        found = true;
      }
    });

    return found;
  },

  getUsers(fields) {
    const emails = this.users.map(user => user.email);
    return Meteor.users.findByEmail(emails, fields);
  },
});

// Fields that are shown in the dashboard
Teams.dashboardFields = {
  name: 1,
  plan: 1,
  type: 1,
  users: 1,
  boards: 1,
  url: 1,
};

Teams.dashboardUsersFields = {
  profile: 1,
  emails: 1,
};

Teams.teamUsersFields = {
  _id: 1,
  profile: 1,
  emails: 1,
};
// Fields that are shown in the team page (/team)
Teams.teamFields = {
  name: 1,
  plan: 1,
  type: 1,
  users: 1,
  boards: 1,
  url: 1,
};

Teams.addUser = (teamId, user) => {
  Teams.update({ _id: teamId }, {
    $push: {
      users: user,
    },
  });
};

Teams.removeUser = (teamId, userEmail) => {
  Teams.update({ _id: teamId }, {
    $pull: {
      users: {
        email: userEmail,
      },
    },
  });
};

Teams.getTeam = (teamId, userEmail, fields = { _id: 1, name: 1 }) => {
  return Teams.find({
    _id: teamId,
    'users.email': userEmail,
    archived: false,
  }, {
    fields,
  });
};
