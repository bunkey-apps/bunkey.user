module.exports = {
	stores: {
		mongo: {
			connection: { uri: 'mongodb://user:123@localhost:27017/bunkey_users' },
    },
	},
	storeDefault: 'mongo',
};
