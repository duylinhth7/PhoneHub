import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  images: {
    type: DataTypes.TEXT, // hoặc DataTypes.JSON nếu bạn lưu mảng
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false
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
  tableName: 'product',
  timestamps: true // tự tạo createdAt & updatedAt
});

export default Product;
