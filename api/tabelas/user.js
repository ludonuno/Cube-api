//Handle the user(s) data with the API
var GetAllUsers = () => {
    console.log('GetAllUsers')
}

var GetUser = (id) => {
    return `GetUser(id:${id})`
}

var CreateUser = () => {
    console.log('CreateUser')
}
var UpdateUser = () => {
    console.log('UpdateUser')
}

var DeleteUser = () => {
    console.log('DeleteUser')
}

module.exports = {
    GetAllUsers,
    GetUser,
    CreateUser,
    UpdateUser,
    DeleteUser
}
