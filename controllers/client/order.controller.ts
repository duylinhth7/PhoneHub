import { Request, Response } from "express";
import Order from "../../models/orders.model";
import sequelize from "../../config/database";
import Product from "../../models/product.model";
import OrderItems from "../../models/order-items.model";
import { QueryTypes } from "sequelize";

//[GET] /order
export const index = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (user) {
      //Dùng truy vấn để lấy ra danh sách đơn hàng
      const orders = await sequelize.query(
        `
      SELECT 
      orders.id, 
      orders.createdAt, 
      orders.status, 
      SUM(order_items.price * order_items.quantity * (1 - (order_items.discount / 100))) AS totalPrice
      FROM orders
      INNER JOIN order_items ON orders.id = order_items.orderId
      WHERE userId = :userId
      GROUP BY orders.id, orders.createdAt, orders.status
      ORDER BY orders.createdAt DESC;
      `,
        {
          replacements: {
            userId: user.userId,
          },
          type: QueryTypes.SELECT,
        }
      );
      res.render("client/pages/order/index", {
        title: "Danh sách đơn hàng",
        orders: orders,
      });
    } else {
      req.flash("error", "Vui lòng đăng nhập");
      return res.redirect("/users/login");
    }
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

// [POST] /order
export const order = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    if (user) {
      const dataOrder = req.body;
      const { fullName, phone, note, address } = dataOrder["infoOrder"];
      const newInfoOrder = {
        userId: user.userId,
        fullName: fullName,
        address: address,
        phone: phone,
        note: note,
        status: "initial",
      };
      const newOrder = await Order.create(newInfoOrder);
      for (const item of dataOrder["cart"]) {
        const infoProuct = await Product.findOne({
          where: {
            id: item["productId"],
            deleted: false,
          },
          raw: true,
        });
        const dataItem = {
          orderId: newOrder["id"],
          productId: item["productId"],
          quantity: item["quantity"],
          price: infoProuct["price"],
          discount: infoProuct["discount"],
        };
        await OrderItems.create(dataItem);
      }
      res.json({
        code: 200,
        orderId: newOrder["id"],
      });
    } else {
      res.json({
        code: 400,
        message: "Vui lòng đăng nhập để đặt hàng!",
      });
    }
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

//[GET] /order/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    //Truy vấn lấy ra danh sách các sản phẩm có trong đơn hàng;
    const order_items = await sequelize.query(
      `
      SELECT ordt.orderId, (ordt.price * ordt.quantity) * (1 - ordt.discount / 100) as special_price,
      ordt.quantity,
      prd.title, prd.images
      FROM order_items as ordt
      INNER JOIN product as prd
      ON ordt.productId = prd.id
      WHERE ordt.orderId = :orderId
      `,
      {
        replacements: { orderId: id },
        type: QueryTypes.SELECT,
      }
    );
    for (const item of order_items) {
      item["image"] = JSON.parse(item["images"])[0];
      item["special_price"] = parseInt(item["special_price"]);
    }
    const totalPrice = order_items.reduce((sum, item) => {
      return sum + item["special_price"];
    }, 0);
    order_items["totalPrice"] = totalPrice;

    //Truy vấn lấy ra thông tin của đơn hàng;
    const order_info = await Order.findOne({
      where: {
        id: id,
        deleted: false,
      },
      raw: true,
    });
    res.render("client/pages/order/detail", {
      title: "Chi tiết đơn hàng",
      order_items: order_items,
      order_info: order_info,
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

//[GET] /order/success
export const success = async (req: Request, res: Response) => {
  res.render("client/pages/order/success", {
    title: "Đặt hàng thành công",
  });
};

//[POST] /order/cancel/:id
export const cancel = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    // Xóa order_items trước (con)
    await OrderItems.destroy({
      where: {
        orderId: id,
      },
    });

    // Sau đó mới xóa order (cha)
    await Order.destroy({
      where: {
        id: id,
      },
    });
    req.flash("success", "Đơn hàng đã được hủy thành công!");
    res.redirect("/order");
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};
