import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /
export const home = async (req: Request, res: Response): Promise<void> => {
  try {
    const productsFeafured = await sequelize.query(
      `SELECT product.*, categories.title as categoryTitle, product.price * (1 - product.discount/100) as special_price
        FROM product 
        INNER JOIN categories 
        ON product.categoryId = categories.id
        WHERE product.deleted = 0 and featured = 1
        `,
      {
        type: QueryTypes.SELECT,
      }
    );
    const productsIphone = await sequelize.query(
      `SELECT product.*, categories.title as categoryTitle, product.price * (1 - product.discount/100) as special_price
        FROM product 
        INNER JOIN categories 
        ON product.categoryId = categories.id
        WHERE product.deleted = 0 and categories.title = "apple"
        LIMIT 8
        `,
      {
        type: QueryTypes.SELECT,
      }
    );
    for (const item of productsFeafured) {
      item["images"] = JSON.parse(item["images"]);
      item["image"] = item["images"][1];
    }
    for (const item of productsIphone) {
      item["images"] = JSON.parse(item["images"]);
      item["image"] = item["images"][1];
    }

    res.render("client/pages/home/index", {
      title: "Trang chủ",
      products: productsFeafured,
      productsIphone: productsIphone,
    });
  } catch (error) {
    console.log("Lỗi:", error);
  }
};
