import {Request, Response} from "express";

// [GET] /index
export const index = async (req:Request, res:Response) => {
    res.render("admin/pages/dashboard/index", {
        title: "Trang chủ"
    })
}