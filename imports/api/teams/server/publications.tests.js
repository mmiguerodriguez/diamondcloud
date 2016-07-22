import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';

import { Teams }                from '../teams.js';
import { DirectChats }          from '../../direct-chats/direct-chats.js';
import { Boards }               from '../../boards/boards.js';

if (Meteor.isServer) {
  let userMails = [
        faker.internet.email(), 
        faker.internet.email(), 
        faker.internet.email(),
      ],
      teamIds  = [Random.id(), Random.id(), Random.id()],
      boardIds = [Random.id(), Random.id(), Random.id()],
      chatIds  = [Random.id(), Random.id(), Random.id()],
      userNotInTeam = [Random.id(), Random.id()],
      user = {
        _id: Random.id(),
        emails: [
          { address: userMails[0] }
        ],
        teams: ({ fields }) => {
          return Teams.find({
            _id: { 
              $in: [
                teamIds[0], 
                teamIds[1],
              ]
            },
          }, { 
            fields 
          });
        },
      };
  
  describe('Teams', function() {
    describe('Publications', function() {
      let teams = [{
            _id: teamIds[0],
            name: faker.lorem.word(),
            plan: 'free',
            type: 'web',
            users: [
              { email: userMails[0], permission: 'owner'},
              { email: userMails[1], permission: 'member' }
            ],
            boards: [ 
              { _id: boardIds[0] }, 
              { _id: boardIds[1] }
            ],
            directChats: [
              { _id: chatIds[0] },
              { _id: chatIds[1] }
            ],
          }, {
            _id: teamIds[1],
            name: faker.lorem.word(),
            plan: 'free',
            type: 'web',
            users: [
              { email: userMails[0], permission: 'owner'},
              { email: userMails[2], permission: 'member' }
            ],
            boards: [
              { _id: boardIds[0] },
              { _id: boardIds[1] }
            ],
            directChats: [
              { _id: chatIds[0] },
              { _id: chatIds[1] }
            ],
          }, {
            _id: teamIds[2],
            name: faker.lorem.word(),
            plan: 'free',
            type: 'web',
            users: [
              { email: userMails[1], permission: 'owner'},
              { email: userMails[2], permission: 'member' }
            ],
            boards: [
              { _id: boardIds[0] },
              { _id: boardIds[1] }
            ],
            directChats: [
              { _id: chatIds[0] },
              { _id: chatIds[1] }
            ],
          }],
          directChats = [{
            _id: chatIds[0],
            teamId: teamIds[0],
            users: [
              { _id: userNotInTeam[0] }, 
              { _id: user._id }
            ],
          }, {
            _id: chatIds[1],
            teamId: teamIds[0],
            users: [
              { _id: userNotInTeam[0] }, 
              { _id: user._id }
            ],
          }, {
            _id: chatIds[2],
            teamId: teamIds[0],
            users: [
              { _id: userNotInTeam[0] }, 
              { _id: userNotInTeam[1] }
            ],
          }],
          boards = [{
            _id: boardIds[0],
            name: faker.lorem.word(),
            isPrivate: false,
            users: [
              { _id: userNotInTeam[0] },
              { _id: user._id }
            ],
          }, {
          _id: boardIds[1],
          name: faker.lorem.word(),
          isPrivate: false,
          users: [
            { _id: userNotInTeam[0] },
            { _id: user._id }
          ],
        }, {
          _id: boardIds[2],
          name: faker.lorem.word(),
          isPrivate: false,
          users: [
            { _id: userNotInTeam[0] },
            { _id: userNotInTeam[1] }
          ],
        }];
      
      beforeEach(function() {
        resetDatabase();
        
        for(let i = 0; i < teams.length; i++)
          Teams.insert(teams[i]);
          
        for(let i = 0; i < directChats.length; i++)
          DirectChats.insert(directChats[i]);
          
        for(let i = 0; i < boards.length; i++)
          Boards.insert(boards[i]);
        
        sinon.stub(Meteor, 'user', () => user);
      });
      
      afterEach(function() {
        Meteor.user.restore();
      });
      
      it('should publish dashboard data', function(done) {
        const collector = new PublicationCollector();
        
        collector.collect('teams.dashboard', (collections) => {
          chai.assert.equal(collections.Teams.length, 2);
          
          collections.Teams.forEach((team, index) => {
            /*
            chai.assert.isTrue(team.name === teams[index].name);
            chai.assert.isTrue(team.plan === teams[index].plan);
            chai.assert.isTrue(team.type === teams[index].type);
            chai.assert.isTrue(JSON.stringify(team.users) === JSON.stringify(teams[index].users));
            */
            chai.assert.isDefined(team.name);
            chai.assert.isDefined(team.plan);
            chai.assert.isDefined(team.type);
            chai.assert.isDefined(team.users);
            chai.assert.isUndefined(team.boards);
            chai.assert.isUndefined(team.directChats);
          });
          done();
        });
      });
      it('should publish team data', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('teams.team', teamIds[0], (collections) => {
          // Check directChats collection
          chai.assert.isDefined(collections.DirectChats);
          collections.DirectChats.forEach((directChat, index) => {
            chai.assert.isDefined(directChat);
            /*
            chai.assert.isTrue(directChat._id == directChats[index]._id);
            chai.assert.isTrue(directChat.teamId == directChats[index].teamId);
            chai.assert.isTrue(JSON.stringify(directChat.users) === JSON.stringify(directChats[index].users));
            */
            chai.assert.isDefined(directChat._id);
            chai.assert.isDefined(directChat.teamId);
            chai.assert.isDefined(directChat.users);
          });
          
          chai.assert.isDefined(collections.DirectChats[0]);
          chai.assert.isDefined(collections.DirectChats[1]);
          chai.assert.isUndefined(collections.DirectChats[2]);
          
          // Check boards collection
          chai.assert.isDefined(collections.Boards);
          collections.Boards.forEach((board, index) => {
            chai.assert.isDefined(board);
            /*
            chai.assert.isTrue(board._id === boards[index]._id);
            chai.assert.isTrue(board.name === boards[index].name);
            */
            chai.assert.isDefined(board._id);
            chai.assert.isDefined(board.name);
          });
          
          chai.assert.isDefined(collections.Boards[0]);
          chai.assert.isDefined(collections.Boards[1]);
          chai.assert.isUndefined(collections.Boards[2]);
          
          done();
        });
      });
    });
  });
}