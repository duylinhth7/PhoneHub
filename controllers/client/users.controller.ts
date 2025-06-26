import { Request, Response } from "express";
import User from "../../models/users.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../models/users.model";

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

//[GET] /users/register;
export const register = async (req: Request, res: Response) => {
  res.render("client/pages/users/register", {
    title: "Tạo tài khoản",
  });
};

//[POST] /users/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const { fullname, email, phone, password } = req.body;

    //SELECT * FROM users WHERE email = {email};
    const exitsEmail = await User.findAll({
      where: {
        email: email,
      },
      raw: true,
    });
    if (exitsEmail.length > 0) {
      req.flash("error", "Email bạn nhập đã tồn tại!");
      return res.redirect("/users/register");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = {
      fullname: fullname,
      email: email,
      phone: phone,
      password: hashedPassword,
      role: "user",
      status: "active",
    };
    const user = await Users.create(newUser);
    const token = jwt.sign(
      {
        userId: user.dataValues.id,
        email: user.dataValues.email,
        role: user.dataValues.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    req.flash("success", "Tạo tài khoản thành công!");
    res.cookie("token", token);
    res.redirect("/");
  } catch (error) {}
};

//[GET] /users/logout
export const logout = async (req: Request, res: Response) => {
  req.flash("success", "Đăng xuất thành công!");
  res.clearCookie("token");
  res.redirect("/");
};

//[GET] /users/login
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/users/login", {
    title: "Trang đăng nhập",
  });
};

//[POST] /users/logion
export const loginPost = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const checkLogin = await Users.findOne({
      where: {
        email: email,
      },
      raw: true,
    });
    if (!checkLogin) {
      req.flash("error", "Email bạn đã nhập không tồn tại!");
      return res.redirect("/users/login");
    } else {
      const isMatch = await bcrypt.compare(password, checkLogin["password"]);
      if (!isMatch) {
        req.flash("error", "Mật khẩu không hợp lệ!");
        return res.redirect("/users/login");
      } else {
        const token = jwt.sign(
          {
            userId: checkLogin["id"],
            email: checkLogin["email"],
            role: checkLogin["role"],
          },
          JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        req.flash("success", "Đăng nhập thành công!");
        res.cookie("token", token);
        res.redirect("/");
      }
    }
  } catch (error) {
    console.log("Lỗi: ", error);
    req.flash("error", "Đã có lỗi xảy ra!");
    return res.redirect("/")
  }
};
