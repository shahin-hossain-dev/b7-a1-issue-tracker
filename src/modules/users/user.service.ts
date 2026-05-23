import { pool } from "@/config/connectDB";
import type { TUser } from "./user.interface";
import bcrypt from "bcryptjs";

const registerUserIntoDB = async (payload: TUser) => {
  const { name, email, password, role } = payload;

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, COALESCE($4::user_role, 'contributor'::user_role))
     RETURNING *`,
    [name, email, hashPass, role ?? null],
  );

  delete result.rows[0].password;

  return result;
};

const getUserFromDB = async () => {
  const result = await pool.query(`
    SELECT * FROM users
    `);

  return result.rows.filter((user) => delete user.password);
};

export const userServices = { registerUserIntoDB, getUserFromDB };
