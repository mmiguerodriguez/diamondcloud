import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';

import { Boards }               from '../boards.js';
import { Drawings }             from '../../drawings/drawings.js';

if (Meteor.isServer) {
  let emails = [
        faker.internet.email(), 
        faker.internet.email(), 
        faker.internet.email(),
      ],
      user = {
        _id: Random.id(),
        emails: [
          { address: emails[0], }
        ],
      },
      drawings = [{
        _id: Random.id(),
        x: faker.random.number(),
        y: faker.random.number(),
        archived: false,
      }, {
        _id: Random.id(),
        x: faker.random.number(),
        y: faker.random.number(),
        archived: false,
      }, {
        _id: Random.id(),
        x: faker.random.number(),
        y: faker.random.number(),
        archived: true,
      }],
      boards = [{
        _id: Random.id(),
        name: faker.lorem.word(),
        isPrivate: false,
        users: [
          { _id: user._id },
          { _id: Random.id() },
          { _id: Random.id() },
        ],
        moduleInstances: [],
        drawings: [
          { _id: drawings[0]._id },
          { _id: drawings[1]._id },
        ],
        archived: false,
      }, {
        _id: Random.id(),
        name: faker.lorem.word(),
        isPrivate: false,
        users: [
          { _id: user._id },
          { _id: Random.id() },
          { _id: Random.id() },
        ],
        moduleInstances: [],
        drawings: [
          { _id: drawings[0]._id },
          { _id: drawings[1]._id },
          { _id: drawings[2]._id },
        ],
        archived: false,
      }, {
        _id: Random.id(),
        name: faker.lorem.word(),
        isPrivate: false,
        users: [
          { _id: Random.id() },
          { _id: Random.id() },
        ],
        moduleInstances: [],
        drawings: [],
        archived: false,
      }, {
        _id: Random.id(),
        name: faker.lorem.word(),
        isPrivate: false,
        users: [
          { _id: user._id },
          { _id: Random.id() },
          { _id: Random.id() },
        ],
        moduleInstances: [],
        drawings: [],
        archived: true,
      }, {
        _id: Random.id(),
        name: faker.lorem.word(),
        isPrivate: true,
        users: [
          { _id: Random.id() },
          { _id: Random.id() },
        ],
        moduleInstances: [],
        drawings: [],
        archived: false,
      }];
  
  describe('Boards', function() {
    describe('Publications', function() {
      beforeEach(function(done) {
        resetDatabase();
        sinon.stub(Meteor, 'user', () => user);
        
        for(let i = 0; i < drawings.length; i++)
          Drawings.insert(drawings[i]);
          
        for(let i = 0; i < boards.length; i++)
          Boards.insert(boards[i]);
          
        done();
      });
      
      afterEach(function() {
        Meteor.user.restore();
      });
      
      it('should publish board data if there are no archived drawings', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[0]._id, (collections) => {
          let board = collections.Boards[0];
          
          chai.assert.isTrue(board.name === boards[0].name);
          chai.assert.isTrue(board.isPrivate === boards[0].isPrivate);
          chai.assert.isTrue(JSON.stringify(board.users) === JSON.stringify(boards[0].users));
          chai.assert.isTrue(board.archived === boards[0].archived);
          chai.assert.isUndefined(board.moduleInstances);
          
          chai.assert.isDefined(collections.Drawings[0]);
          chai.assert.isDefined(collections.Drawings[1]);
          
          done();
        });
      });
      it('should publish board data if there are archived drawings', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[1]._id, (collections) => {
          let board = collections.Boards[0];
          
          chai.assert.isTrue(board.name === boards[1].name);
          chai.assert.isTrue(board.isPrivate === boards[1].isPrivate);
          chai.assert.isTrue(JSON.stringify(board.users) === JSON.stringify(boards[1].users));
          chai.assert.isTrue(board.archived === boards[1].archived);
          chai.assert.isUndefined(board.moduleInstances);
        
          chai.assert.isDefined(collections.Drawings[0]);
          chai.assert.isDefined(collections.Drawings[1]);
          chai.assert.isUndefined(collections.Drawings[2]);
          done();
        });
      });
      it('should publish board data if there are no drawings', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[2]._id, (collections) => {
          let board = collections.Boards[0];
          
          chai.assert.isTrue(board.name === boards[2].name);
          chai.assert.isTrue(board.isPrivate === boards[2].isPrivate);
          chai.assert.isTrue(JSON.stringify(board.users) === JSON.stringify(boards[2].users));
          chai.assert.isTrue(board.archived === boards[2].archived);
          chai.assert.isUndefined(board.moduleInstances);
        
          chai.assert.isUndefined(collections.Drawings);
          done();
        });
      });
      it('should not publish board data if it is archived', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[3]._id, (collections) => {
          chai.assert.isUndefined(collections.Boards);
          done();
        });
      });
      it('should not publish private board data if the user is not in it', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[4]._id, (collections) => {
          chai.assert.isUndefined(collections.Boards);
          done();
        });
      });
    });
  });
}