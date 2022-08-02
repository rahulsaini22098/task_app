import { Sequelize } from "sequelize";

const sequelize = new Sequelize("task", "root", "allspark", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
