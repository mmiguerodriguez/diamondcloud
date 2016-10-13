import { Meteor }          from 'meteor/meteor';
import { Random }          from 'meteor/random';
import faker		           from 'faker';

import { Teams }           from '../teams/teams.js';
import { Boards }          from '../boards/boards.js';
import { Messages }        from '../messages/messages.js';
import { DirectChats }     from '../direct-chats/direct-chats.js';
import { APICollection } 	 from '../api-collection/api-collection.js';
import { ModuleInstances } from '../module-instances/module-instances.js';

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
	type: Random.choice(['Creativos', 'Coordinadores', 'Directores']),
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
	boards: [],
	users: [
		{ email: faker.internet.email(), permission: 'owner' }
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
