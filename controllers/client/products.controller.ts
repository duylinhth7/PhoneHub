import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /products/:slug
export const detail = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slug;
    const detailProduct = await sequelize.query(
      `   SELECT product.*, categories.title as categoryTitle, product.price * (1 - product.discount/100) as special_price
        FROM product 
        INNER JOIN categories 
        ON product.categoryId = categories.id
        WHERE product.deleted = 0 and product.slug = :slug`,
      {
        replacements: { slug },
        type: QueryTypes.SELECT,
      }
    );
    detailProduct[0]["images"] = JSON.parse(detailProduct[0]["images"]);
    res.render("client/pages/products/detail", {
      title: detailProduct[0]["title"],
      detailProduct: detailProduct[0],
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};
