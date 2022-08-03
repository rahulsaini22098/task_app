import { Model, UUIDV4 } from "sequelize";

interface TaskAttributes {
  id: string;
  taskname: string;
  isDone?: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Todo extends Model<TaskAttributes> implements TaskAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: string;
    taskname!: string;
    isDone?: string;
    static associate(models: any) {
      // define association here
      Todo.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
      });
    }
  }

  Todo.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      taskname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Todo;
};
