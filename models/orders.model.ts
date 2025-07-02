import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {   
      model: 'users', // tên bảng trong DB
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
    fullname: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  note: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true // sẽ tự tạo createdAt và updatedAt
});

export default Order;
