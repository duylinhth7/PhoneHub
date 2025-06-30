import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const ForgetPassword = sequelize.define("ForgetPassword", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  otp: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'forget_password',
  timestamps: false // Vì không có updatedAt
});

export default ForgetPassword;
