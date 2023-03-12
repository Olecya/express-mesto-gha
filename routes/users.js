const express = require("express");
const routerUsers = express.Router();

const { getUsers, getUserId, createUser, patchUser, patchUserAvatar } = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUserId);
routerUsers.post('/', createUser);
routerUsers.patch('/me', patchUser);
routerUsers.patch('/me/avatar', patchUserAvatar);

module.exports = routerUsers;

// { createUser, getUsers, getUser, patchUser, patchUserAvatar }