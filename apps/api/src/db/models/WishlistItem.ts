import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const WishlistItem = sequelize.define(
  "WishlistItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    wishlist_id: {
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

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "wishlist_items",
    timestamps: false,
  }
);

export default WishlistItem;