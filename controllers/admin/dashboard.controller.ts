import {Request, Response} from "express";
import Users from "../../models/users.model";
import Order from "../../models/orders.model";
import Product from "../../models/product.model";
import Categories from "../../models/categories.model";

// [GET] /index
export const index = async (req:Request, res:Response) => {
    const countAccount = await Users.count();
    const countOrder = await Order.count();
    const countProduct = await Product.count();
    const countCategories = await Categories.count();
    res.render("admin/pages/dashboard/index", {
        title: "Trang chủ",
        countAccount: countAccount,
        countOrder: countOrder,
        countProduct: countProduct,
        countCategories: countCategories
    })
}