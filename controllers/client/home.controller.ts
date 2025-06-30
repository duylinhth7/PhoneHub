import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /
export const home = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await sequelize.query(
        `SELECT product.*, categories.title as categoryTitle, product.price * (1 - product.discount/100) as special_price
        FROM product 
        INNER JOIN categories 
        ON product.categoryId = categories.id
        WHERE product.deleted = 0
        `, 
        {
      type: QueryTypes.SELECT,
    });
    for(const item of products){
        item["images"] = JSON.parse(item["images"]);
        item["image"] = item["images"][0];
    }
    res.render("client/pages/home/index", {
      title: "Trang chủ",
      productsFeatured: products
    });
  } catch (error) {
    console.log("Lỗi:" , error)
  }
};
