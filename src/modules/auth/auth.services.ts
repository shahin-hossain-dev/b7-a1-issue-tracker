import { pool } from "@/config/connectDB";
import type { TLoginPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "@/config/config";
import { UnauthorizedError } from "@/errors";

const loginUser = async (payload: TLoginPayload) => {
  const { email, password } = payload;

  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = rows[0];

  if (!user) throw new UnauthorizedError("Invalid email or password");

  //generate token

  const tokenPayload = { name: user.name, role: user.role, email: user.email };

  const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: "1d" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new UnauthorizedError("Invalid email or password");

  delete user.password;

  return { token, user };
};

export const authServices = { loginUser };
