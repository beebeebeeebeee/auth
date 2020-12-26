var mysql = require("mysql");
var mysql_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "auth",
  charset: "utf8mb4",
};

let conn = mysql.createConnection(mysql_config);

const disconnect_handler = () => {
  conn = mysql.createConnection(mysql_config);
  conn.connect((err) => {
    err && setTimeout("disconnect_handler()", 2000);
  });

  conn.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // db error 重新連線
      disconnect_handler();
    } else {
      throw err;
    }
  });

};

const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, binding, (err, result, fields) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = { disconnect_handler, query };
