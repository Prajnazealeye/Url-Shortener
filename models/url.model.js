
const { DataTypes } = require("sequelize");
const db = require("../config/dbConnection")

const urlModel = {
    URLCode: {
        type: DataTypes.STRING,

    },
    longUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shortUrl: {
        type: DataTypes.STRING,

    },
}

const urlSchema = db.pgConn.define('URL', urlModel, db.ModelOptions)

module.exports = { urlSchema }


