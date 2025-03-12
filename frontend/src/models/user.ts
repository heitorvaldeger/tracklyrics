export interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  emailStatus: "VERIFIED" | "UNVERIFIED";
}
