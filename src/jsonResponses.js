// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: "Name and age are both required",
  };

  if(!body.name || !body.age){
    responseJSON.id = "addUserMissingParams"; // We can make the error ID whatever we want
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204; // "Success with no body content sent"
  
  if(!users[body.name]){ // If we don't have that user yet
    responseCode = 201;
    users[body.name] = {
      name: body.name,
      age: body.age,
    };
  }

  users[body.name].age = body.age;

  if(responseCode === 201){
    responseJSON.message = "Created successfully";
    return respondJSON(request, response, responseCode, responseJSON);
  }
  
  return respondJSONMeta(request, response, responseCode);
};

module.exports = {
  getUsers,
  addUser,
};
