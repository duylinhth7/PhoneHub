import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.token;
  if (token) {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      if(user){
        res.locals.user = user;
      }
    } catch (error) {
      console.log("Đã xảy ra lỗi: ", error);
    }
  }
  next();
};
