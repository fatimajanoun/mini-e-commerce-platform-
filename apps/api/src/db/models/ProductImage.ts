import { DataTypes } from "sequelize";
import sequelize from "../index.js";

const ProductImage = sequelize.define(
  "ProductImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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

    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },

    is_primary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product_images",
    timestamps: false,
  }
);

export default ProductImage;