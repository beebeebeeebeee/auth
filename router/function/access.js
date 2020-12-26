const database = require("../conf/connect_database");

const getOne = async (email) => {
  database.disconnect_handler();

  const results = await database.query(
    "SELECT * FROM `users` WHERE `users`.`email` = ?",
    [email]
  );

  return results;
};

const register = async(data)=>{
  database.disconnect_handler();

  const results = await database.query(
    "INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES (?, ?, ?, ?)",
    [data.id, data.name, data.email, data.password]
  );

  return results;
}

const login = async(data)=>{
  database.disconnect_handler();

  const results = await database.query(
    "SELECT * FROM `users` WHERE `users`.`email` = ? AND `users`.`password` = ?",
    [data.email, data.password]
  );

  return results;
}

module.exports = {getOne, register, login};