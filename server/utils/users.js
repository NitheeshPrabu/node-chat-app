class Users {
	constructor() {
		this.users = [];
	}

	addUser(id, name, room) {
		var newUser = {id, name, room};
		
		var existingUser = this.getUserByName(newUser.name);
		if (existingUser)
			return existingUser, true;

		this.users.push(newUser);
		return newUser, false;
	}

	removeUser(id) {
		var user = this.getUser(id);
		if (user) {
			this.users = this.users.filter((user) => user.id !== id);
		}

		return user;
	}

	getUserByName(name) {
		return this.users.filter((user) => user.name === name)[0];
	}

	getUser(id) {
		return this.users.filter((user) => user.id === id)[0];
	}

	getUserList(room) {
		var users = this.users.filter((user) => user.room === room);
		var namesArray = users.map((user) => user.name);

		return namesArray;
	}
}

module.exports = { Users };