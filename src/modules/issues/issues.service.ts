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

const getAllIssuesFromDB = async () => {
  const result = await pool.query(`
    SELECT  i.*,

    json_build_object(
        'id',u.id,
        'name', u.name,
        'role', u.role
    ) AS reporter

    FROM issues i

    JOIN users u
    ON i.reporter_id = u.id
    
    `);

  const users = result.rows.filter((user) => delete user.reporter_id);
  return users;
};

export const issueServices = { createIssueIntoDB, getAllIssuesFromDB };
