import { Mongo } from 'meteor/mongo';

export let Teams = new Mongo.Collection('Teams');

Teams.helpers({
  owner() {
    let found = false;
    let owner;
    
    this.users.forEach((user, index) => {
      if(user.permission == "owner"){
        found = true;
        owner = user.email;
      }
    });
    
    if(!found) {
      throw new Meteor.Error('Teams.owner.noOwner', 
      'The team has no owner.');
    }
    return owner;
  },
  hasUser(obj){
    // If obj.mail exists then use it, if not, use the id
    let mail = obj.email || Meteor.users.findOne(obj._id).emails[0].address;
    let found = false;
    
    this.users.forEach((user) => {
      if(user.email == mail) {
        found = true;
      }
    });
    
    return found;
  }
});

// Fields that are shown in the dashboard
Teams.dashboardFields = {
  name: 1,
  plan: 1,
  type: 1,
  users: 1,
};

// Fields that are shown in the team page (/team)
Teams.teamFields = {
  name: 1,
  plan: 1,
  type: 1,
  users: 1,
  boards: 1,
};

Teams.addUser = (teamId, user, callback) => {
  callback = callback || (() => {});
  Teams.update({ _id: teamId }, {
    $push: {
      users: user
    }
  });
  return callback();
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