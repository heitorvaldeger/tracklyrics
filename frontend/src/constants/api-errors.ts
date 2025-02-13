import { HttpStatusCode } from "axios";

export const APIErrors = {
  0: "Internal Error",
  [HttpStatusCode.BadRequest]: "Bad Request",
  [HttpStatusCode.Unauthorized]: "Unauthorized",
  [HttpStatusCode.Forbidden]: "Forbidden",
  [HttpStatusCode.NotFound]: "Not Found",
  [HttpStatusCode.UnprocessableEntity]: "Unprocessable Content",
  [HttpStatusCode.InternalServerError]: "Internal Server Error"
} as Record<number, string>