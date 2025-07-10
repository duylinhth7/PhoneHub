import { Request, Response } from "express";
import Users from "../../models/users.model";
import { Op } from "sequelize";
import panigationHelper from "../../helpers/panigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { systemConfig } from "../../config/system";
import sendMail from "../../helpers/sendMail";
import sequelize from "../../config/database";

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;
const PATH_ADMIN = systemConfig.prefixAdmin;

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    let where = {
      deleted: false
    };

    //Phần tìm  kiếm
    if (req.query.search) {
      const fullname = req.query.search;
      where["fullname"] = {
        [Op.regexp]: fullname,
      };
    }
    //End phần tìm kiếm

    //Phần lọc Featured
    let role: string;
    if (req.query.role) {
      role = req.query.role;
      where["role"] = role;
    }
    //End phần lọc Featured
    //Phân trang BACKEND
    const countAccounts = await Users.count({
      where: where,
    });
    const objectPanigation = panigationHelper(
      {
        currentPage: 1,
        limitItems: 3,
      },
      req.query,
      countAccounts
    );
    //END phân trang BE;
    const accounts = await Users.findAll({
      where: where,
      raw: true,
      limit: objectPanigation.limitItems,
      offset: objectPanigation.skipItems || 0,
      order: [["createdAt", "DESC"]],
    });
    res.render("admin/pages/accounts/index", {
      title: "Danh sách tài khoản",
      accounts: accounts,
      objectPanigation: objectPanigation,
      roleFillter: role,
    });
  } catch (error) {
    console.log("Lỗi!");
  }
};

// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/accounts/create", {
    title: "Tạo tài khoản",
  });
};

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const { fullname, email, phone, password, role, status } = req.body;
    //SELECT * FROM users WHERE email = {email};
    const exitsEmail = await Users.findAll({
      where: {
        email: email,
      },
      raw: true,
    });

    //CHECK xem email đã tồn tại chưa
    if (exitsEmail.length > 0) {
      req.flash("error", "Email bạn nhập đã tồn tại!");
      return res.redirect(PATH_ADMIN + "/accounts/create");
    }

    //Mã hóa pass
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body["password"] = hashedPassword;

    //Lưu vào DB
    await Users.create(req.body);
    req.flash("success", "Tạo tài khoản thành công!");
    res.redirect(PATH_ADMIN + "/accounts");
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

// [GET] /admin/accounts/my-account
export const myAccount = async (req: Request, res: Response) => {
  try {
    const id = res.locals.accountAdmin.adminId;
    const myAccount = await Users.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
    res.render("admin/pages/accounts/my-account", {
      title: "Tài khoản của tôi!",
      account: myAccount,
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

// [GET] /admin/accounts/detail/:id
export const detailAccount = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const account = await Users.findOne({
      where: {
        id: id,
      },
      raw: true,
    });
    res.render("admin/pages/accounts/detail", {
      title: "Chi tiết tài khoản",
      account: account,
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

// [POST] /admin/accounts/edit/:id
export const editAccount = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const { fullname, email, phone, password, role, status } = req.body;
    const editAccount = {
      fullname,
      email,
      phone,
      role,
      status,
    };

    //Nếu ADMIN thay đổi password
    if (password !== "") {
      const passwordHashed = await bcrypt.hash(password, saltRounds);
      editAccount["password"] = passwordHashed;
    }

    //Lưu lại thông tin update vào DB
    await Users.update(editAccount, {
      where: { id: id },
    });

    //Gửi mail cho user sau khi admin update lại thông tin account;
    const subject = "Thông báo cập nhật thông tin tài khoản";

    const html = `
  <div style="max-width: 500px; margin: 0 auto; padding: 20px; 
              border: 1px solid #e0e0e0; border-radius: 8px; 
              background-color: #f9f9f9; font-family: Arial, sans-serif; 
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); color: #333;">
    
    <h2 style="text-align: center; color: #28a745;">Cập nhật tài khoản thành công</h2>
    
    <p>Xin chào <strong>${fullname}</strong>,</p>
    
    <p>Thông tin tài khoản của bạn vừa được <strong>cập nhật bởi quản trị viên</strong>.</p>

    <p style="margin: 16px 0;">Dưới đây là thông tin mới sau khi cập nhật:</p>

    <ul style="list-style: none; padding-left: 0;">
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Số điện thoại:</strong> ${phone}</li>
      <li><strong>Vai trò:</strong> ${role}</li>
      <li><strong>Trạng thái:</strong> ${
        status === "active" ? "Đang hoạt động" : "Vô hiệu hóa"
      }</li>
      ${
        password
          ? `<li><strong>Mật khẩu mới:</strong> <code>${password}</code></li>`
          : ""
      }
    </ul>

    ${
      password
        ? `<p><strong>Lưu ý:</strong> Bạn nên đăng nhập và đổi mật khẩu ngay sau khi nhận được thông tin này để đảm bảo an toàn tài khoản.</p>`
        : ""
    }

    <p>Nếu bạn không yêu cầu thay đổi này hoặc nghi ngờ có điều bất thường, 
       vui lòng liên hệ ngay với bộ phận hỗ trợ.</p>

    <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;">

    <p style="font-size: 14px; color: #666; text-align: center;">
      Trân trọng,<br>
      Đội ngũ quản trị hệ thống
    </p>
  </div>
`;

    sendMail(email, subject, html);
    req.flash("success", "Cập nhật thông tin thành công!");
    return res.redirect(PATH_ADMIN + `/accounts/detail/${id}`)
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};


// [DELETE] /admin/accounts/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const id:string = req.params.id;
    
    await Users.update({
      deleted: true
    }, {
      where: {id: id}
    });
    req.flash("success", "Xóa tài khoản thành công!");
    return res.redirect(PATH_ADMIN + "/accounts")
  } catch (error) {
    console.log("Lỗi: ", error)
  }
}