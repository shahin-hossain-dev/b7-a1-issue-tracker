import { pool } from "@/config/connectDB";
import type { TIssue } from "./issues.interface";
import type { TUser } from "../users/user.interface";
import { USER_ROLE } from "@/types";
import { ForbiddenError } from "@/errors";

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

const getSingleIssueFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT i.*,
    json_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role
    ) AS reporter
    FROM issues i
    JOIN users u ON i.reporter_id = u.id
    WHERE i.id = $1
    `,
    [id],
  );

  const issue = result.rows[0];
  if (issue) delete issue.reporter_id;
  return issue;
};

const updateSingleIssueIntoDB = async (
  id: string,
  payload: Partial<TIssue>,
  user: TUser,
) => {
  //   const { title, description, type, status } = payload;
  const { id: reqUserId, role } = user;

  const getIssue: TIssue | undefined = await getSingleIssueFromDB(id);

  if (!getIssue) {
    throw new Error("Issue not found");
  }

  const reporterId = getIssue?.reporter?.id as number;

  const updateIssue = async (id: string, payload: Partial<TIssue>) => {
    const { title, description, type, status } = payload;

    const result = await pool.query(
      `
    UPDATE issues
    SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3::issue_type, type),
      updated_at  = NOW()
    WHERE id = $5
    RETURNING *
    `,
      [title ?? null, description ?? null, type ?? null, status ?? null, id],
    );

    return result.rows[0];
  };

  if (role === USER_ROLE.maintainer) {
    return updateIssue(id, payload);
  }
  if (
    role === USER_ROLE.contributor &&
    reqUserId === reporterId &&
    getIssue.status === "open"
  ) {
    return updateIssue(id, payload);
  } else {
    throw new ForbiddenError("Access denied");
  }
};

const deleteSingleIssueFromDB = async (id: string) => {
  const getIssue: TIssue | undefined = await getSingleIssueFromDB(id);

  if (!getIssue) {
    throw new Error("Issue not found");
  }

  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
};

export const issueServices = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateSingleIssueIntoDB,
  deleteSingleIssueFromDB,
};
