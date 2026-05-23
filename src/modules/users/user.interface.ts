export type TUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
};
