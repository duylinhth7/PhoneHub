import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { systemConfig } from "../../config/system";

const JWT_SECRET = process.env.JWT_SECRET;
const PATH_ADMIN = systemConfig.prefixAdmin;

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tokenAdmin: string = req.cookies.tokenAdmin;
    if (tokenAdmin) {
      const account = jwt.verify(tokenAdmin, JWT_SECRET);
      if (account) {
        if (account["role"] !== "user") {
          res.locals.accountAdmin = account;
          next();
        } else {
          req.flash(
            "error",
            "Tài khoản của bạn không được phép truy cập vào đây!"
          );
          return res.redirect(PATH_ADMIN + "/auth/login");
        }
      }
    } else {
      req.flash("error", "Tài khoản của bạn không được phép truy cập vào đây!");
      return res.redirect(PATH_ADMIN + "/auth/login");
    }
  } catch (error) {
    console.log("Lỗi!");
  }
};
