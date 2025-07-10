import { Request, Response, NextFunction } from "express";
import { systemConfig } from "../../config/system";

const PATH_ADMIN = systemConfig.prefixAdmin;

export const create = (req: Request, res: Response, next: NextFunction) => {
  const { fullname, email, phone, password, role, status } = req.body;

  // Kiểm tra dữ liệu bắt buộc
  if (!fullname || !email || !phone || !password || !role || !status) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin!");
    return res.redirect(PATH_ADMIN + "/accounts/create");
  }
  // if (password.length < 6) {...}
  // if (!email.includes("@")) {...}

  next();
};

export const edit = (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;
  const { fullname, email, phone, password, role, status } = req.body;

  // Kiểm tra dữ liệu bắt buộc
  if (!fullname || !email || !phone || !role || !status) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin!");
    return res.redirect(PATH_ADMIN + `/accounts/detail/${id}`);
  }
  // if (password.length < 6) {...}
  // if (!email.includes("@")) {...}

  next();
};
