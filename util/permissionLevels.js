const { owner, botAdministrators = [], botSupport = [] } = require('../config');

module.exports =
	[{ name: 'User',
		rank: 0,
		check: () => true },
	{
		name: 'Bot Administrator',
		rank: 9,
		check: ({ from: { id } }) => botAdministrators.includes(id)
	},
	{
		name: 'Owner',
		rank: 10,
		check: ({ from: { id } }) => id == owner
	}];
