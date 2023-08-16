import Sequelize, { Sequelize as Seq } from 'sequelize-typescript'
import {env} from '../config/env';
const db = new Seq(env.DB_NAME, env.DB_USER, env.DB_PASS, {
  host: env.DB_HOST,
  dialect: "mysql",
  storage: ':memory:',
  // operatorsAliases: false,
  define: {
    timestamps: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, 
    idle: 10000
  },
  models:[__dirname+'/../models/**/*.model.ts',__dirname+'/../models/**/*.model.js'],
  logging:false
});
export { db, Sequelize }