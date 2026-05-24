import { pool } from "@/config/connectDB";
import type { TIssue } from "./issues.interface";
import type { TUser } from "../users/user.interface";
import { USER_ROLE } from "@/types";
import { ForbiddenError, NotFoundError } from "@/errors";

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

type TGetAllIssuesQuery = {
  sort?: "newest" | "oldest";
  type?: TIssue["type"];
  status?: TIssue["status"];
};

const getReportersByIds = async (ids: number[]) => {
  const result = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [ids],
  );
  return Object.fromEntries(
    result.rows.map((u: { id: number; name: string; role: string }) => [
      u.id,
      u,
    ]),
  );
};

const getAllIssuesFromDB = async (query: TGetAllIssuesQuery = {}) => {
  const { sort = "newest", type, status } = query;

  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}::issue_type`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}::issue_status`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause =
    sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";

  // Query 1: fetch issues only (no JOIN)
  const issuesResult = await pool.query(
    `SELECT * FROM issues ${whereClause} ${orderClause}`,
    values,
  );
  const issues = issuesResult.rows;

  if (issues.length === 0) return [];

  // Query 2: fetch all reporters in one batch
  const reporterIds = [
    ...new Set(issues.map((i: { reporter_id: number }) => i.reporter_id)),
  ];
  const reporterMap = await getReportersByIds(reporterIds);

  return issues.map(
    (issue: { reporter_id: number; [key: string]: unknown }) => {
      const { reporter_id, ...rest } = issue;
      return { ...rest, reporter: reporterMap[reporter_id] ?? null };
    },
  );
};

const getSingleIssueFromDB = async (id: string) => {
  // Query 1: fetch the issue
  const issueResult = await pool.query(`SELECT * FROM issues WHERE id = $1`, [
    id,
  ]);
  const issue = issueResult.rows[0];
  if (!issue) return undefined;

  // Query 2: fetch the reporter
  const userResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );
  const reporter = userResult.rows[0] ?? null;

  const { reporter_id, ...rest } = issue;
  return { ...rest, reporter };
};

const updateSingleIssueIntoDB = async (
  id: string,
  payload: Partial<TIssue>,
  user: TUser,
) => {
  const { id: reqUserId, role } = user;

  const getIssue: TIssue | undefined = await getSingleIssueFromDB(id);

  if (!getIssue) {
    throw new NotFoundError("Issue not found");
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
      status = COALESCE($4::issue_status, status),
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
