import { Meteor }        from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { sinon }         from 'meteor/practicalmeteor:sinon';
import { chai }          from 'meteor/practicalmeteor:chai';
import { Random }        from 'meteor/random';
import   faker           from 'faker';

import { Teams }         from './teams.js';
import { createTeam,
         editTeam,
         shareTeam,
         removeUserFromTeam,
         archiveTeam,
         dearchiveTeam,
}                        from './methods.js';
import { createBoard }   from '../boards/methods.js';

if (Meteor.isServer) {
  describe('Teams', function() {
    let user = {
      emails: [{ address: faker.internet.email() }],
    },
        name = faker.lorem.word(), 
        usersEmails = [faker.internet.email(), faker.internet.email()],
        boardId = Random.id(),
        team = { 
          _id: Random.id(),
          name, 
          plan: 'free', 
          type: 'web', 
          boards: [
            { _id: boardId }
          ], 
          users: [
            { email: user.emails[0].address, permission: 'owner' },
            { email: usersEmails[0], permission: 'member' },
            { email: usersEmails[1], permission: 'member' },
          ],
          archived: false,
        };
    
    beforeEach(function() {
      resetDatabase();
      sinon.stub(createBoard, 'call', (obj, callback) => {
        let team = Teams.findOne(obj.teamId);
        team.boards.push({ _id: boardId });
        Teams.update({ _id: obj.teamId }, team);
        callback(null, boardId);
      });
      sinon.stub(Meteor, 'user', () => user);
      
      Teams.insert(team);
    });
    afterEach(function() {
      createBoard.call.restore();
      Meteor.user.restore();
    });
    
    it('should create a team', function() {
      let args,
          result,
          expect;
          
      args = {
        name,
        plan: 'free',
        type: 'web',
        usersEmails,
      };
      expect = {
        name,
        plan: 'free',
        type: 'web',
        boards: [{ _id: boardId }],
        users: [
          { email: user.emails[0].address, permission: 'owner' },
          { email: usersEmails[0], permission: 'member' },
          { email: usersEmails[1], permission: 'member' },
        ],
        archived: false,
      };
      
      createTeam.call(args, (err, res) => {
        result = res;
      });
    
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    it('should edit a team', function() {
      let result,
          expect, 
          args;
          
      expect = {
        _id: team._id,
        name: 'test',
        plan: 'premium',
        type: 'dota',
        boards: [{ _id: boardId }],
        users: [
          { email: user.emails[0].address, permission: 'owner' },
          { email: usersEmails[0], permission: 'member' },
          { email: usersEmails[1], permission: 'member' },
        ],
        archived: false,
      };
      args = {
        team: {
          name: 'test',
          plan: 'premium',
          type: 'dota',
        },
        teamId: team._id,
      };
      
      editTeam.call(args, (err, res) => {
        result = res;
      });
      
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    it('should share a team', function() {
      let result,
          expect, 
          args;
          
      expect = {
        _id: team._id,
        name,
        plan: 'free',
        type: 'web',
        boards: [{ _id: boardId }],
        users: [
          { email: user.emails[0].address, permission: 'owner' },
          { email: usersEmails[0], permission: 'member' },
          { email: usersEmails[1], permission: 'member' },
          { email: 'test@test.com', permission: 'member' }, 
        ],
        archived: false,
      };
      args = {
        email: 'test@test.com',
        teamId: team._id,
      };
          
      shareTeam.call(args, (err, res) => {
        result = res;
      });

      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    it('should remove a user from a team', function() {
      let result,
          expect, 
          args;
          
      expect = {
        _id: team._id,
        name,
        plan: 'free',
        type: 'web',
        boards: [{ _id: boardId }],
        users: [
          { email: user.emails[0].address, permission: 'owner' },
          { email: usersEmails[0], permission: 'member' },
        ],
        archived: false,
      };
      args = {
        email: usersEmails[1],
        teamId: team._id,
      };
      
      removeUserFromTeam.call(args, (err, res) => {
        result = res;
      });
      
      chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
    });
    it('should archive a team', function(done) {
      let result,
          expect, 
          args;
          
      args = { 
        teamId: team._id, 
      };
      expect = team;
      expect.archived = true;
      
      archiveTeam.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err); 
        result = res;
        
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
        done();
      });
    });
    it('should dearchive a team', function(done) {
      let result,
          expect, 
          args;
          
      args = {
        teamId: team._id,
      };
      expect = team;
      expect.archived = false;
      
      dearchiveTeam.call(args, (err, res) => {
        if(err) throw new Meteor.Error(err); 
        result = res;
      
        chai.assert.isTrue(JSON.stringify(result) === JSON.stringify(expect));
        done();
      });
    });
  });
}