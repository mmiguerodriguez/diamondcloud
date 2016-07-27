import { Meteor }               from 'meteor/meteor';
import { resetDatabase }        from 'meteor/xolvio:cleaner';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { sinon }                from 'meteor/practicalmeteor:sinon';
import { chai }                 from 'meteor/practicalmeteor:chai';
import { Random }               from 'meteor/random';
import   faker                  from 'faker';
import                               './publications.js';

import { Boards }               from '../boards.js';

if (Meteor.isServer) {
  describe('Boards', function() {
    describe('Publications', function() {

      beforeEach(function(done) {
        resetDatabase();

        user = Factory.create('user');
        boards = [
          Factory.create('publicBoard'),
          Factory.create('board', { archived: true }),
          Factory.create('privateBoard'),
          Factory.create('privateBoard')
        ];

        boards[2].users.push({ _id: user._id });
        boards[3].users = [];

        resetDatabase();

        Meteor.users.insert(user);

        boards.forEach((board) => {
          Boards.insert(board);
        });

        sinon.stub(Meteor, 'user', () => user);

        done();
      });

      afterEach(function() {
        Meteor.user.restore();
      });
      it('should publish board data if it is public', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[0]._id, (collections) => {
          chai.assert.isDefined(collections.Boards);
          done();
        });
      });

      it('should not publish board data if it is archived', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[1]._id, (collections) => {
          chai.assert.isUndefined(collections.Boards);
          done();
        });
      });

      it('should publish private board data if the user is in it', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[2]._id, (collections) => {
          chai.assert.isDefined(collections.Boards);
          done();
        });
      });

      it('should not publish private board data if the user is not in it', function(done) {
        const collector = new PublicationCollector({ userId: user._id });
        collector.collect('boards.board', boards[3]._id, (collections) => {
          chai.assert.isUndefined(collections.Boards);
          done();
        });
      });
    });
  });
}
