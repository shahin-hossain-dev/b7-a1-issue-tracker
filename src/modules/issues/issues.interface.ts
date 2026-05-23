export type TIssueType = "bug" | "feature_request";
export type TIssueStatus = "open" | "in_progress" | "resolved";

export type TIssue = {
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter_id: string;
};
