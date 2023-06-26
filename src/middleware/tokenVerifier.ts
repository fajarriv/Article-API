import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface RequestWithUserId extends Request {
  userId: Number;
}

export const tokenVerifier = (
  req: RequestWithUserId,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.header("Authorization");
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Token is not valid" });
      } else {
        const { id } = decoded as { id: Number };
        req.userId = id;
        next();
      }
    });
  } else {
    return res.status(401).send({ message: "Unauthorized" });
  }
};
