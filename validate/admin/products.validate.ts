import {Request, Response, NextFunction} from "express";
import { systemConfig } from "../../config/system";


const PATH_ADMIN = systemConfig.prefixAdmin;
export const createValidate = (req:Request, res:Response, next:NextFunction) => {
    const {title, price, discount, stock, imagesFiles, imageUrls, description, categoryId} = req.body;
    if(!title || !price || !discount || !stock || !categoryId){
        req.flash("error", "Vui lòng nhập đầy đủ thông tin!");
        return res.redirect(PATH_ADMIN + "/products/create");
    };
    if(!imagesFiles && !imageUrls){
        req.flash("error", "Vui lòng nhập đầy đủ thông tin!");
        return res.redirect(PATH_ADMIN + "/products/create");
    };
    next();
}