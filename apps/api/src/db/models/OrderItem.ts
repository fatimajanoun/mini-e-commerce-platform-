import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    variant_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    product_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    variant_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "order_items",
    timestamps: false,
  }
);

export default OrderItem;