"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("variants", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      value: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
    await queryInterface.addIndex(
      "variants",
      ["product_id"],
      {
        name: "variants_product_id_idx",
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("variants");
  },
};