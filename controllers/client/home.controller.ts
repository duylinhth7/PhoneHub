import {Request, Response} from "express";

// [GET] /
export const home = async (req:Request, res:Response):Promise<void> => {
    res.render("client/pages/home/index", {
        title: "Trang chủ"
    })
}