const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {

	var users;
	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: 1,
			name: 'Mike',
			room: 'Test Room 1'
		},
		{
			id: 2,
			name: 'Jen',
			room: 'Test Room 2'
		},
		{
			id: 3,
			name: 'Julie',
			room: 'Test Room 1'
		}];
	});

	it('should add a new user', () => {
		var users = new Users();
		var user = {
			id: 123,
			name: 'test',
			room: 'test room'
		};

		var res = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('should return names for test room 1', () => {
		var userList = users.getUserList('Test Room 1');

		expect(userList).toEqual(['Mike', 'Julie']);
	});

	it('should return names for test room 2', () => {
		var userList = users.getUserList('Test Room 2');

		expect(userList).toEqual(['Jen']);
	});

	it('should remove a user', () => {
		var userId = 1;
		var user = users.removeUser(userId);

		expect(user.id).toBe(userId);
		expect(users.users.length).toBe(2);
	});

	it('should not remove a user', () => {
		var userId = 99;
		var user = users.removeUser(userId);

		expect(user).toBeFalsy();
	});

	it('should find a user by id', () => {
		var userId = 2;
		var user = users.getUser(userId);

		expect(user.id).toBe(userId);
	});

	it('should not find a user by id', () => {
		var userId = 99;
		var user = users.getUser(userId);

		expect(user).toBeFalsy();
	});
});