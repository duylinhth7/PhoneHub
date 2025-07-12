import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

// [GET] /search/suggest
export const suggest = async (req: Request, res: Response) => {
  try {
    const q = req.query.q;
    const keyword = `%${q}%`;

    //Dùng SQL query để tìm sp;
    const products = await sequelize.query(
      "SELECT *, price * (1 - discount/100) as special_price FROM product WHERE title LIKE :search LIMIT 4",
      {
        replacements: { search: keyword },
        type: QueryTypes.SELECT,
      }
    );
    if (products.length > 0) {
      for (const item of products) {
        item["image"] = JSON.parse(item["images"])[0]
      }
      return res.status(200).json(products);
    };
    res.json(400).json({
        message: "Không tìm thấy sản phẩm"
    })
  } catch (error) {
    console.log("Lỗi:", error);
  }
};
