import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../models/users.model";

const PATH_ADMIN = systemConfig.prefixAdmin;
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
  res.render("admin/pages/auth/login", {
    title: "Đăng nhập quản trị!",
    noHeader: true,
    noPartial: true
  });
};

// [GET] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash("error", "Vui  lòng nhập đầy đủ thông tin!");
      return res.redirect(PATH_ADMIN + "/auth/login");
    }

    //Check đăng nhập account
    const checkLogin = await Users.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
    if (!checkLogin) {
      req.flash("error", "Email bạn đã nhập không tồn tại!");
      return res.redirect(PATH_ADMIN + "/auth/login");
    }

    //Check password account
    const isMatch = await bcrypt.compare(password, checkLogin["password"]);
    if (!isMatch) {
      req.flash("error", "Mật khẩu không hợp lệ!");
      return res.redirect(PATH_ADMIN + "/auth/login");
    }
    if (checkLogin["role"] === "user") {
      req.flash("error", "Tài khoản của bạn không được phép truy cập vào đây!");
      return res.redirect(PATH_ADMIN + "/auth/login");
    }
    const tokenAdmin = jwt.sign(
      {
        adminId: checkLogin["id"],
        email: checkLogin["email"],
        role: checkLogin["role"],
        fullname: checkLogin["fullname"]
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    req.flash("success", "Đăng nhập thành công!");
    res.cookie("tokenAdmin", tokenAdmin);
    res.redirect(PATH_ADMIN + "/dashboard");
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

// [GET] /admin/auth/logout
export const logout = async (req:Request, res:Request) => {
    res.clearCookie("tokenAdmin");
    req.flash("success", "Đăng xuất thành công!");
    return res.redirect(PATH_ADMIN + "/auth/login")
}
