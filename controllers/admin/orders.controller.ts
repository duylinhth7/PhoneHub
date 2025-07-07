import { Request, Response } from "express";
import Order from "../../models/orders.model";
import panigationHelper from "../../helpers/panigation";
import { systemConfig } from "../../config/system";
import { QueryTypes } from "sequelize";
import sequelize from "../../config/database";
import OrderItems from "../../models/order-items.model";

const PATH_ADMIN = systemConfig.prefixAdmin;
// [GET] /admin/orders
export const index = async (req: Request, res: Request) => {
  try {
    let where = {
        deleted: false
    };
    //Phân trang BACKEND
    const count = await Order.count({
      where: { deleted: false },
    });
    const objectPanigation = panigationHelper(
      {
        currentPage: 1,
        limitItems: 3,
      },
      req.query,
      count
    );
    //END phân trang BE;

    //Lọc theo status
    let statusFilter = '';
    if(req.query.status){
        where["status"] = req.query.status,
        statusFilter = req.query.status
    }
    //END lọc theo status
    const orders = await Order.findAll({
      where: where,
      raw: true,
      order: [["createdAt", "DESC"]],
      limit: objectPanigation.limitItems,
      offset: objectPanigation.skipItems || 0,
    });
    res.render("admin/pages/orders/index", {
      title: "Danh sách đơn hàng",
      orders: orders,
      objectPanigation: objectPanigation,
      statusFilter: statusFilter
    });
  } catch (error) {
    console.log("Lỗi!", error);
  }
};

//[PATCH] /admin/orders/confirmed
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const statusChange = req.body.statusChange;
    await Order.update(
      {
        status: statusChange,
      },
      {
        where: { id: id },
      }
    );
    res.json({
      code: 200,
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
    console.log("Lỗi!", error);
  }
};

//[GET] /admin/orders/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
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
    res.render("admin/pages/orders/detail", {
      title: "Chi tiết đơn hàng",
      order_items: order_items,
      order: order_info,
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

// [DELETE] /admin/orders/delete/:id
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    // Xóa order_items trước (con)
    await OrderItems.update(
      {
        deleted: true,
        deletedAt: Date.now(),
      },
      {
        where: {
          orderId: id,
        },
      }
    );

    // Sau đó mới xóa order (cha)
    await Order.update(
      {
        deleted: true,
        deletedAt: Date.now(),
        status: "reject",
      },
      {
        where: {
          id: id,
        },
      }
    );
    req.flash("success", "Đơn hàng đã được hủy thành công!");
    res.redirect(PATH_ADMIN + "/orders");
  } catch (error) {
    console.log("Lỗi: ", error)
  }
};
