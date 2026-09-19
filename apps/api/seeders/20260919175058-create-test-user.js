import bcrypt from "bcrypt";

export default {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash("Test123!", 12);

    await queryInterface.bulkInsert("users", [
      {
        email: "test@example.com",
        password_hash: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      email: "test@example.com",
    });
  },
};