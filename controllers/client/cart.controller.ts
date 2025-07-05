import { Request, Response } from "express";
import Product from "../../models/product.model";

// [GET] /cart
export const index = async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (user) {
    res.render("client/pages/cart/index", {
      title: "Giỏ hàng",
    });
  } else{
    req.flash("error", "Vui lòng đăng nhập!");
    res.redirect("/users/login");
  }
};

//[POST] /list
export const listCart = async (req: Request, res: Response) => {
  try {
    const cartData = req.body;
    let listCart = [];
    for (const item of cartData) {
      const product = await Product.findOne({
        where: {
          id: item.productId,
        },
        raw: true,
        attributes: [
          "id",
          "title",
          "price",
          "discount",
          "images",
          "slug",
          "stock",
        ],
      });
      product["image"] = JSON.parse(product["images"])[0];
      product["special_price"] =
        product["price"] * (1 - product["discount"] / 100);
      product["quantity"] = item.quantity;
      product["totalPrice"] = product["quantity"] * product["special_price"];
      listCart.push(product);
    }
    res.json({
      code: 200,
      listCart: listCart,
    });
  } catch (error) {
    res.json({
      code: 400,
      errr: error,
      message: "Lỗi",
    });
  }
};
