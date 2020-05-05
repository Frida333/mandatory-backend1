let users = [];

const addUser = ({id, name , room}) => {
  name = name.trim();
  room = room.trim();

  const userTaken = users.find((user) => {
    user.room === room && user.name === name
  });

  if(userTaken){
    return {error: "Namnet är redan taget"};
  }
  const user = {id,name,room};
  users.push(user);

  return{user};
}

 const getUser =(id) =>  users.find((user) =>  user.id === id);


module.exports = {addUser, getUser};
