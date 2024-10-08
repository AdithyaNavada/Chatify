const users = [];

// join users to chat

function userJoin(id , username , room)
{
    const user = { id , username ,room};
    users.push(user);
    return user;
}

// Get current user
function getCurentUser(id){
    return users.find(user => user.id === id);
}

// user leaves
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

// to get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurentUser,
    userLeave,
    getRoomUsers
}