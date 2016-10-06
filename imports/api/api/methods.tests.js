import { Meteor }                  from 'meteor/meteor';
import { resetDatabase }           from 'meteor/xolvio:cleaner';
import { sinon }                   from 'meteor/practicalmeteor:sinon';
import { chai }                    from 'meteor/practicalmeteor:chai';
import { Random }                  from 'meteor/random';
import { printObject }             from '../helpers/print-objects.js';
import   faker                     from 'faker';
import                                  '../factories/factories.js';

import { Boards }                  from '../boards/boards.js';
import { ModuleInstances }         from '../module-instances/module-instances.js';
import { APICollection }           from '../api-collection/api-collection.js';
import { Teams }                   from '../teams/teams.js';
import {
  createModuleInstance,
  editModuleInstance,
  archiveModuleInstance,
  dearchiveModuleInstance,
  APIInsert,
  APIUpdate,
  APIGet,
  APIRemove,
}                                  from './methods.js';

if (Meteor.isServer) {
  describe('API', function() {
    describe('Methods', function() {
      beforeEach(function() {
        resetDatabase();

        sinon.stub(Meteor, 'user', () => user);
        sinon.stub(Meteor, 'userId', () => user._id);
        sinon.stub(Boards, 'isValid', () => true);
      });

      afterEach(function() {
        Meteor.user.restore();
        Meteor.userId.restore();
        Boards.isValid.restore();
      });

      it('should create a collection and an entry in module data', function(done) {
        done();
      });

      it('should update an entry in module data', function(done) {
        done();
      });

      it('should get an entry from module data', function(done) {
        done();
      });

      it('should remove an entry from module data', function(done) {
        done();
      });

      it('should update using persistent data when indicated', function(done) {
        done();
      });

      it('should get using persistent data when indicated', function(done) {
        done();
      });

      it('should remove using persistent data when indicated', function(done) {
        done();
      });
    });
  });
}
