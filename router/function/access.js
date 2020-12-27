const database = require("../conf/connect_database");

const getOne = async (account) => {
  database.disconnect_handler();

  const results = await database.query(
    "SELECT * FROM `users` WHERE `users`.`account` = ?",
    [account]
  );

  return results;
};

const register = async(data)=>{
  database.disconnect_handler();

  const results = await database.query(
    "INSERT INTO `users` (`id`, `name`, `account`, `password`) VALUES (?, ?, ?, ?)",
    [data.id, data.name, data.account, data.password]
  );

  return results;
}

const getData = async(id)=>{
  database.disconnect_handler();

  const results = await database.query(
    "SELECT * FROM `users` WHERE `users`.`id` = ?",
    [id]
  );

  return results;
}

module.exports = {getOne, register, getData};