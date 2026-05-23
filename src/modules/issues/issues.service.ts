import { pool } from "@/config/connectDB";
import type { TIssue } from "./issues.interface";

const createIssueIntoDB = async (payload: TIssue) => {
  const { title, description, type, reporter_id } = payload;

  const result = await pool.query(
    `
    INSERT INTO issues(title, description, reporter_id, type)
    VALUES($1, $2, $3, COALESCE($4::issue_type))
    RETURNING *
    `,
    [title, description, reporter_id, type],
  );

  return result.rows[0];
};

export const issueServices = { createIssueIntoDB };
