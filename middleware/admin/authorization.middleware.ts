import {Request, Response, NextFunction} from "express";
import { systemConfig } from "../../config/system";


const PATH_ADMIN = systemConfig.prefixAdmin;
//Phần middleware phần quyền ADMIN;
const authorization = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!res.locals.accountAdmin){
            req.flash("error", "Vui lòng đăng nhập trước!");
            return res.redirect(PATH_ADMIN + "/auth/login");
        }
        const role = res.locals.accountAdmin["role"];
        if(permission === role || role === "admin"){
            next();
        } else {
            console.log(role)
            req.flash("error", "Bạn không được cấp quyền truy cập!");
            return res.redirect(PATH_ADMIN + "/dashboard");
        }
    }
}

export default authorization;