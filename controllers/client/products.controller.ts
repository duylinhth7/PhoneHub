import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";
import panigationHelper from "../../helpers/panigation";
import Reviews from "../../models/reviews.model";

// [GET] /products/:slug
export const detail = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slug;

    //Lấy ra thông tin chi tiết sản phẩm
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

    //Xử lý phần image của sản phẩm
    detailProduct[0]["images"] = JSON.parse(detailProduct[0]["images"]);

    //Kiểm tra xem sản phẩm đó có thông số kỹ thuật ko?
    if (detailProduct[0]["tskt"])
      detailProduct[0]["tskt"] = JSON.parse(detailProduct[0]["tskt"]);

    //Phân trang BACKEND
    const count = await Reviews.count({
      where: {
        productId: detailProduct[0]["id"],
      },
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

    // Lấy ra các đánh giá - reviews của user với sản phẩm;
    const reviews = await sequelize.query(
      `SELECT reviews.*, users.fullname  FROM reviews 
      JOIN users
      ON reviews.userId = users.id
      WHERE reviews.productId = :id
      ORDER BY createdAt DESC
      LIMIT :limit
      OFFSET :skip
      `,
      {
        replacements: {
          id: detailProduct[0]["id"],
          limit: objectPanigation.limitItems,
          skip: objectPanigation.skipItems || 0,
        },
        type: QueryTypes.SELECT,
      }
    );

    res.render("client/pages/products/detail", {
      title: detailProduct[0]["title"],
      detailProduct: detailProduct[0],
      reviews: reviews,
      objectPanigation: objectPanigation
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};
