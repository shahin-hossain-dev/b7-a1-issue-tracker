import config from "@/config/config";
import { pool } from "@/config/connectDB";
import type { TRole } from "@/types";
import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import jwt, { type JwtPayload } from "jsonwebtoken";

const auth = (...roles: TRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    try {
      if (!token) {
        res.status(status.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized access!!",
        });
      }

      const decodedToken = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as JwtPayload;

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decodedToken.email],
      );

      const user = userData.rows[0];

      delete user.password;

      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found!",
        });
      }

      req.user = user;
    } catch (error) {
      next(error);
    }

    next();
  };
};

export default auth;
