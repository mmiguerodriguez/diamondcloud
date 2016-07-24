import faker		     from 'faker';
import { Random }    from 'meteor/random';

import { Users }     from '../users/users.js';
import { Teams }     from '../teams/teams.js';
import { Boards }    from '../boards/boards.js';
import { Messages }  from '../messages/messages.js';
import { direct-chats }  from '../direct-chats/direct-chats.js';

Factory.define('user', Users, {
	_id: () => Random.id(),
	emails: () => {
		[{ address: faker.internet.email() }]
	},
});

Factory.define('team', Teams, {
	_id: () => Random.id(),
	name: () => faker.company.companyName(),
	plan: () => Random.choice(['free', 'premium']),
	type: () => Random.choice(['web', 'android', 'ios', 'marketing']),
	boards: [];
	users: () => {
		[
			{ email: Factory.get('user').emails[0].address, permission: 'owner' }
		]
	}
	archived: false,
});

Factory.define('board', Boards, {
	_id: () => Random.id(),
	name: () => faker.lorem.word(),
	isPrivate: null,
	users: [],
	moduleInstances: [],
	archived: false,
});

Factory.define('publicBoard', Boards, Factory.extend('board', {
	isPrivate: false,
	users: undefined,
}));

Factory.define('privateBoard', Boards, Factory.extend('board', {
	isPrivate: true,
	users: () => {
		[
			_id: Factory.get('user')._id,
		],
	},
}));

Factory.define('message', Messages, {
	_id: () => Random.id(),
	senderId: () => Factory.get('user')._id,
	type: "text",
	content: () => faker.lorem.sentence(),
	createdAt: () => new Date(),
});

Factory.define('directChatMessage', Messages, Factory.extend('message', {
	directChatId: Factory.get('directChat')._id,
}));

Factory.define('boardMessage', Messages, Factory.extend('message', {
	directChatId: Factory.get('board'),
}));

Factory.define('directChat', direct-chats, {
	_id: () => Random.id(),
	teamId: Factory.get('team'),
	users: () => {
		[
			{ _id: Random.id() },
			{ _id: Random.id() },
		]
	}
});