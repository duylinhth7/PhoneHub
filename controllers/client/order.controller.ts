import { Request, Response } from "express";
import Order from "../../models/orders.model";
import sequelize from "../../config/database";
import Product from "../../models/product.model";
import OrderItems from "../../models/order-items.model";

// [POST] /order
export const order = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const dataOrder = req.body;
    const  {fullName, phone, note, address} = dataOrder["infoOrder"];
    const newInfoOrder = {
        userId: user ? user.id : null,
        fullName: fullName,
        address: address,
        phone: phone,
        note: note,
        status: "initial"
    }
    const newOrder = await Order.create(newInfoOrder);
    for(const item of dataOrder["cart"]){
        const infoProuct = await Product.findOne({
            where: {
                id: item["productId"],
                deleted: false
            }, 
            raw: true
        })
        const dataItem = {
            orderId: newOrder["id"],
            productId: item["productId"],
            quantity: item["quantity"],
            price: infoProuct["price"],
            discount: infoProuct["discount"]
        };
        await OrderItems.create(dataItem);
    };
    res.json({
        code: 200,
        orderId: newOrder["id"]
    })
  } catch (error) {
    console.log("Lỗi: ", error)
  }
};
