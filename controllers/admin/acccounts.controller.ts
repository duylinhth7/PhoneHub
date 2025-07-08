import { Request, Response } from "express";
import Users from "../../models/users.model";
import { Op } from "sequelize";
import panigationHelper from "../../helpers/panigation";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { systemConfig } from "../../config/system";

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;
const PATH_ADMIN = systemConfig.prefixAdmin

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    let where = {};

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
      order: [["createdAt", "DESC"]]
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
    console.log("Lỗi: ",error)
  }
};


// [GET] /admin/accounts/my-account
export const myAccount = async (req:Request, res:Response) => {
    try {
        const id =  res.locals.accountAdmin.adminId
        const myAccount = await Users.findOne({
            where: {
                id: id
            },
            raw: true
        });
        res.render("admin/pages/accounts/my-account", {
            title: "Tài khoản của tôi!",
            account: myAccount
        })
    } catch (error) {
        console.log("Lỗi: ", error)
    }
}
