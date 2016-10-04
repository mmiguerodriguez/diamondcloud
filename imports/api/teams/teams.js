import { Mongo } from 'meteor/mongo';

export let Teams = new Mongo.Collection('Teams');

Teams.helpers({
  owner() {
    let found = false;
    let owner;

    this.users.forEach((user, index) => {
      if (user.permission == "owner"){
        found = true;
        owner = user.email;
      }
    });

    if (!found) {
      throw new Meteor.Error('Teams.owner.noOwner',
      'The team has no owner.');
    }

    return owner;
  },
  hasUser(user) {
    let mail, found = false;

    if (typeof user === 'string'){
      user = Meteor.users.findOne(user);
      mail = user.email();
    } else {
      if (user._id) {
        user = Meteor.users.findOne(user._id);
        mail = user.email();
      } else if (typeof user.email === 'string') {
        mail = user.email;
      }
    }

    this.users.forEach((user) => {
      if (user.email == mail) {
        found = true;
      }
    });

    return found;
  },
  getUsers(fields) {
    let emails = this.users.map((user) => user.email);
    return Meteor.users.findByEmail(emails, fields);
  }
});

// Fields that are shown in the dashboard
Teams.dashboardFields = {
  name: 1,
  plan: 1,
  type: 1,
  users: 1,
  boards: 1,
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
};

Teams.addUser = (teamId, user) => {
  Teams.update({ _id: teamId }, {
    $push: {
      users: user,
    }
  });
};
Teams.removeUser = (teamId, userEmail) => {
  Teams.update({ _id: teamId }, {
    $pull: {
      users : {
        email: userEmail,
      },
    },
  });
};
Teams.getTeam = (teamId, userEmail, fields) => {
  fields = fields || { _id: 1, name: 1 };
  return Teams.find({
    _id: teamId,
    'users.email': userEmail,
    archived: false,
  }, {
    fields
  });
};
