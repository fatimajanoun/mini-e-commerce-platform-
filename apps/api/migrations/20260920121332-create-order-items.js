"use strict";

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      variant_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "variants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      product_title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      variant_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex(
      "order_items",
      ["order_id"],
      {
        name: "order_items_order_id_idx",
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("order_items");
  },
};