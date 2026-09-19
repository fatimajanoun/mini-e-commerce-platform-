import bcrypt from "bcrypt";
import User from "../../db/models/user.js";

export const login = async (email: string, password: string) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.get("password_hash") as string
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.get("id") as string,
    email: user.get("email") as string,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.get("id") as string,
    email: user.get("email") as string,
  }
};