const { DataTypes } = require("sequelize");
const db = require("../config/dbConnection");

const urlModel = {
  URLCode: {
    type: DataTypes.STRING,

  },
  longUrl: {
    type: DataTypes.STRING(450),
    allowNull: false,
  },
  shortUrl: {
    type: DataTypes.STRING,

  },
  expirationDate: {
    type: DataTypes.DATE, // Date data type for representing expiration date
  },
};

const urlSchema = db.pgConn.define("URL", urlModel, db.ModelOptions);

module.exports = { urlSchema };
