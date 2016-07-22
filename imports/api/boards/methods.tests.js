import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from '../teams/teams.js';
import { Boards }        from './boards.js';
import { createBoard,
         archiveBoard,
         dearchiveBoard,
}                        from './methods.js';

if (Meteor.isServer) {
  describe('Boards', function() {
    let usersIds = [Random.id(), Random.id(), Random.id()],
        emails = [faker.internet.email(), faker.internet.email(), faker.internet.email()],
        user = {
          _id: usersIds[0],
          emails: [{ address: emails[0] }],
        },
        board = {
          _id: Random.id(),
          name: faker.lorem.word(),
          isPrivate: false,
          users: [
            { _id: usersIds[0] }, 
            { _id: usersIds[1] }, 
            { _id: usersIds[2] }
          ],
          moduleInstances: [],
          drawings: [],
          archived: false,
        },
        team = {
          _id: Random.id(),
          name: faker.lorem.word(),
          plan: 'free',
          type: faker.lorem.word(),
          users: [
            { email: emails[0], permission: 'owner' },
            { email: emails[1], permission: 'member' },
            { email: emails[2], permission: 'member' },
          ],
          boards: [{ _id: board._id }],
          drawings: [],
          archived: false,
        };
    
    beforeEach(function() {
      resetDatabase();
      sinon.stub(Meteor, 'user', () => user);
      
      Meteor.users.insert(user);
      Meteor.users.insert({
        _id: usersIds[1],
        emails: [{ address: emails[1] }],
      });
      Meteor.users.insert({
        _id: usersIds[2],
        emails: [{ address: emails[2] }],
      });
      
      Teams.insert(team);
      Boards.insert(board);
    });
    afterEach(function() {
      Meteor.user.restore();
    });
    
    it('should create a board', function(done) {
      let test_1,
          test_2,
          result_1,
          result_2,
          expect_1,
          expect_2;
      
      test_1 = {
        teamId: team._id,
        name: faker.lorem.word(),
        isPrivate: false,
      };
      test_2 = {
        teamId: team._id,
        name: faker.lorem.word(),
        isPrivate: true,
        users: [
          { _id: usersIds[0] },
          { _id: usersIds[1] },
          { _id: usersIds[2] }
        ],
      };
      expect_1 = {
        name: test_1.name,
        isPrivate: test_1.isPrivate, 
        users: [],
        moduleInstances: [],
        drawings: [],
        archived: false,
      };
      expect_2 = {
        name: test_2.name,
        isPrivate: test_2.isPrivate,
        users: test_2.users,
        moduleInstances: [],
        drawings: [],
        archived: false,
      };
      
      createBoard.call(test_1, (err, res) => {
        if(err) throw new Meteor.Error(err);
        
        result_1 = res;
        
        createBoard.call(test_2, (err, res) => {
          if(err) throw new Meteor.Error(err);
          
          result_2 = res;
          
          chai.assert.isTrue(JSON.stringify(result_1) === JSON.stringify(expect_1));
          chai.assert.isTrue(JSON.stringify(result_2) === JSON.stringify(expect_2));
          done();
        });
      });
    });
    it('should archive a board', function(done) {
      let result,
          expect = board;
      
      archiveBoard.call({ _id: board._id }, (err, res) => {
        if(err) throw new Meteor.Error(err);
        
        result = res;
        expect.archived = true;
        
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
        done();
      });
    });
    it('should dearchive a board', function(done) {
      let result,
          expect = board;
          
      dearchiveBoard.call({ _id: board._id }, (err, res) => {
        if(err) throw new Meteor.Error(err);
        
        result = res;
        expect.archived = false;
        
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
        done();
      });
    });
  });
}