import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from '../teams/teams.js';
import { Boards }        from './boards.js';

if (Meteor.isServer) {
  describe('Boards', function() {
    describe('Helpers', function() {
      let user = {
            _id: Random.id(),
            emails: [{
              address: faker.internet.email(), 
            }],
          },
          boards = [{
            _id: Random.id(),
            name: faker.lorem.word(),
            isPrivate: false,
            users: [
              { _id: user._id }, 
              { _id: Random.id() }, 
              { _id: Random.id() }
            ],
            moduleInstances: [],
            drawings: [],
            archived: false,
          }, {
            _id: Random.id(),
            name: faker.lorem.word(),
            isPrivate: false,
            users: [],
            moduleInstances: [],
            drawings: [],
            archived: false,
          }],
          teams = [{
            _id: Random.id(),
            name: faker.lorem.word(),
            plan: 'free',
            type: faker.lorem.word(),
            users: [
              { email: user.emails[0].address, permission: 'owner' },
              { email: faker.internet.email(), permission: 'member' },
              { email: faker.internet.email(), permission: 'member' },
            ],
            boards: [
              { _id: boards[0]._id }
            ],
            drawings: [],
            archived: false,
          }, {
            _id: Random.id(),
            name: faker.lorem.word(),
            plan: 'free',
            type: faker.lorem.word(),
            users: [
              { email: user.emails[0].address, permission: 'owner' },
              { email: faker.internet.email(), permission: 'member' },
              { email: faker.internet.email(), permission: 'member' },
            ],
            boards: [],
            drawings: [],
            archived: false,
          }];
      
      beforeEach(function() {
        resetDatabase();
        sinon.stub(Meteor, 'user', () => user);
        
        Meteor.users.insert(user);
        
        for(let i = 0; i < boards.length; i++)
          Boards.insert(boards[i]);
          
        for(let i = 0; i < teams.length; i++)
          Teams.insert(teams[i]);

      });
      afterEach(function() {
        Meteor.user.restore();
      });
      
      it('should return the team of a board', function() {
        let board = Boards.findOne(boards[0]._id);
        let team = board.team();

        chai.assert.isTrue(team._id === teams[0]._id);
      });
      it('should not return the team of a board', function() {
        let board = Boards.findOne(boards[1]._id);
        let team = board.team();
        
        chai.assert.isUndefined(team);
      });
    });
  });
}