import { Meteor }          from 'meteor/meteor';
import { Random }          from 'meteor/random';
import { Factory }         from 'meteor/dburles:factory';
import faker               from 'faker';

import { Teams }           from '../teams/teams';
import { Boards }          from '../boards/boards';
import { Messages }        from '../messages/messages';
import { BoardTypes }      from '../board-types/board-types';
import { Hierarchies }     from '../hierarchies/hierarchies';
import { Permissions }     from '../permissions/permissions';
import { DirectChats }     from '../direct-chats/direct-chats';
import { APICollection } 	 from '../api-collection/api-collection';
import { ModuleInstances } from '../module-instances/module-instances';

Factory.define('user', Meteor.users, {
	emails: [
		{ address: faker.internet.email() }
	],
	profile: {
		name: faker.name.findName(),
	},
});

Factory.define('board', Boards, {
	name: faker.lorem.word(),
	users: [],
	type: Random.choice(['creativos', 'sistemas', 'directores creativos', 'directores de cuentas', 'administradores', 'coordinadores', 'medios']),
	isPrivate: null,
	moduleInstances: [],
	archived: false,
	visibleForDirectors: false,
});

Factory.define('publicBoard', Boards, Factory.extend('board', {
	isPrivate: false,
	users: [],
}));

Factory.define('privateBoard', Boards, Factory.extend('board', {
	isPrivate: true,
	users: [
		{ email: faker.internet.email(), notifications: faker.random.number({ min: 0, max: 20 }) },
	],
}));

Factory.define('team', Teams, {
	name: faker.company.companyName(),
	plan: Random.choice(['free', 'premium']),
	type: Random.choice(['web', 'android', 'ios', 'marketing']),
	url: 'random_url',
	boards: [],
	users: [
		{ email: faker.internet.email(), hierarchy: 'sistemas' }
	],
	archived: false,
});

Factory.define('directChat', DirectChats, {
	teamId: Factory.get('team'),
	users: [
		{ _id: Random.id(), notifications: faker.random.number({ min: 0, max: 20 }) },
		{ _id: Random.id(), notifications: faker.random.number({ min: 0, max: 20 }) },
	]
});

Factory.define('message', Messages, {
	senderId: Factory.get('user')._id,
	type: "text",
	content: faker.lorem.sentence(),
	createdAt: new Date()
});

Factory.define('directChatMessage', Messages, Factory.extend('message', {
	directChatId: Factory.get('directChat')._id,
	seen: false,
}));

Factory.define('boardMessage', Messages, Factory.extend('message', {
	boardId: Factory.get('board')._id,
	seers: [],
}));

Factory.define('moduleInstance', ModuleInstances, {
	moduleId: Random.id(),
	x: faker.random.number(),
	y: faker.random.number(),
	width: faker.random.number({ min: 0, max: 1920 }),
	height: faker.random.number({ min: 0, max: 1080 }),
	archived: false,
	minimized: false,
});

Factory.define('globalAPIDocument', APICollection, {
	moduleId: Random.id(),
	teamId: Random.id(),
	collection: faker.lorem.word(),
});

Factory.define('notGlobalAPIDocument', APICollection, {
	moduleInstanceId: Random.id(),
	collection: faker.lorem.word(),
});

let obj = {};
for (let i = 0; i < 4; i++) {
	obj[faker.lorem.word()] = faker.lorem.word();
}

Factory.define('spamAPIDocument', APICollection, obj);

Factory.define('hierarchy', Hierarchies, {
	name: faker.lorem.word(),
	teamId: Random.id(),
	permissions: [],
});

/**
 * Returns a boardType
 *
 * @returns {Object} boardType
 */
Factory.define('boardType', BoardTypes, {
	name: faker.lorem.word(),
	properties: [
		faker.lorem.word(),
		faker.lorem.word(),
	],
});

Factory.define('permission', Permissions, {
  key: () => faker.lorem.word(),
  name: () => faker.lorem.word(),
  description: () => faker.lorem.sentence(),
});
