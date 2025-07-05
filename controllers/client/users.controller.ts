import { Request, Response } from "express";
import User from "../../models/users.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../../models/users.model";
import { genarateNumber } from "../../helpers/genarate";
import ForgetPassword from "../../models/forget-password.model";
import sendMail from "../../helpers/sendMail";
import { where } from "sequelize";
import sequelize from "../../config/database";

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

//[GET] /users/register;
export const register = async (req: Request, res: Response) => {
  if(res.locals.user){
    req.flash("error", "Vui lòng đăng xuất trước!")
    return res.redirect("/")
  };
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
    if(res.locals.user){
    req.flash("error", "Vui lòng đăng xuất trước!")
    return res.redirect("/")
  };
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
    return res.redirect("/");
  }
};

//[GET] /users/forget
export const forgetPassword = async (req: Request, res: Response) => {
  res.render("client/pages//users/forget-password", {
    title: "Quên mật khẩu",
  });
};

//[POST] /users/forget
export const forgetPasswordPost = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    //SELECT * FROM email = email and status = "active";
    const exitsEmail = await User.findOne({
      where: {
        email: email,
        status: "active",
      },
      attributes: ["email"],
      raw: true,
    });
    if (!exitsEmail) {
      req.flash("error", "Email bạn đã nhập không hợp lệ!");
      return res.redirect("/users/password/forget");
    }
    //Tạo mã OTP mới;
    const otp = genarateNumber(5);

    //Lưu lại mã OTP đã tạo vào database;
    const objectForgetPassword = {
      email: email,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    await ForgetPassword.create(objectForgetPassword);
    //Gửi mail xác nhận OTP;
    const subject = "Xác minh đặt lại mật khẩu - Mã OTP của bạn";

    const html = `
  <div style="max-width: 500px; margin: 0 auto; padding: 20px; 
              border: 1px solid #e0e0e0; border-radius: 8px; 
              background-color: #f9f9f9; font-family: Arial, sans-serif; 
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); color: #333;">
    
    <h2 style="text-align: center; color: #007BFF;">Mã OTP Xác Minh</h2>
    
    <p>Xin chào,</p>
    
    <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
    
    <p style="margin: 16px 0;">Vui lòng sử dụng mã OTP bên dưới để xác minh yêu cầu:</p>
    
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; padding: 12px 24px; 
                   font-size: 24px; font-weight: bold; 
                   background-color: #e6f0ff; color: #007BFF; 
                   border-radius: 6px; letter-spacing: 2px;">
        ${otp}
      </span>
    </div>
    
    <p><strong>Lưu ý:</strong> Mã OTP chỉ có hiệu lực trong vòng <strong>5 phút</strong>.</p>
    
    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
    
    <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;">
    
    <p style="font-size: 14px; color: #666; text-align: center;">
      Trân trọng,<br>
      Đội ngũ hỗ trợ
    </p>
  </div>
`;
    sendMail(email, subject, html);
    req.flash("success", "Chúng tôi đã gửi mã OTP qua email của bạn!");
    return res.render("client/pages/users/otp", {
      title: "Xác thực OTP",
      email: email,
    });
  } catch (error) {
    console.log("Đã xảy ra lỗi: ", error);
  }
};

//[POST] /users/otp
export const otpPassword = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const otp: string = req.body.otp;
    //Check xem OTP trong database có trùng với OTP user nhập không?
    //SELECT * FROM forget_password WHERE email = email and otp = email;
    const exitsOtp = await ForgetPassword.findOne({
      where: {
        email: email,
        otp: otp,
      },
      raw: true,
    });
    //Nếu mã OTP ko hợp lệ;
    if (!exitsOtp) {
      req.flash("error", "Mã OTP không hợp lệ!");
      return res.redirect("/users/password/forget");
    }
    //Nếu mã OTP đã quá hạn;
    if (exitsOtp["expiresAt"] < new Date()) {
      req.flash("error", "OTP bạn nhập đã quá hạn 5 phút!");
      return res.redirect("/users/password/forget");
    }

    //Nếu user nhập đúng mã OTP;
    req.flash("success", "Mã OTP hợp lệ!");
    const infoUser = await User.findOne({
      where: {
        email: email,
        status: "active",
      },
      raw: true,
      attributes: ["email", "role", "id"],
    });
    const token = jwt.sign(
      {
        userId: infoUser["id"],
        email: infoUser["email"],
        role: infoUser["role"],
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token);
    await sequelize.query(
      "DELETE FROM forget_password WHERE email = :email and otp = :otp",
      {
        replacements: {
          email: email,
          otp: otp,
        },
      }
    );
    return res.redirect("/users/password/reset");
  } catch (error) {
    console.log("Đã xảy ra lỗi: ", error);
  }
};

//[GET] /users/password/reset;
export const resetPassword = async (req: Request, res: Response) => {
  res.render("client/pages/users/resetPassword", {
    title: "Đặt lại mật khẩu",
  });
};

//[POST] /users/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const password: string = req.body.password;
    const email: string = res.locals.user.email;
    const userId: number = res.locals.user.userId;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //Update lại password sau khi đã mã hóa;
    await sequelize.query(
      "UPDATE users SET password = :password WHERE email = :email and id = :userId",
      {
        replacements: {
          password: hashedPassword,
          email: email,
          userId: userId,
        },
      }
    );
    req.flash("success", "Đặt lại mật khẩu thành công!");
    return res.redirect("/");
  } catch (error) {
    console.log("Xảy ra lỗi: ", error);
  }
};
