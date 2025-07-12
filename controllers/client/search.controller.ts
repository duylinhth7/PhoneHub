import { Request, Response } from "express";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";
import panigationHelper from "../../helpers/panigation";

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
        item["image"] = JSON.parse(item["images"])[0];
      }
      return res.status(200).json(products);
    } else {
      res.json(400).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
  } catch (error) {
    console.log("Lỗi:", error);
  }
};

// [GET] /search
export const searchAll = async (req: Request, res: Response) => {
  try {
    const q = req.query.q;
    if (q) {
      const keyword = `%${q}%`;
      const count = await sequelize.query(
        "SELECT COUNT(*) as total FROM product where title LIKE :keyword",
        {
          replacements: { keyword: keyword },
          type: QueryTypes.SELECT,
        }
      );

      //Phân trang tìm kiểm BE
      const objectPanigation = panigationHelper(
        {
          currentPage: 1,
          limitItems: 8,
        },
        req.query,
        count[0]["total"]
      );
      //END phân trang BE;

      //Phần sort
      let sortName = "createdAt";
      let typeSort: "ASC" | "DESC" = "DESC";
      const rawSort = req.query.sort?.toString().toLowerCase();
      if(rawSort === "desc" || rawSort === "asc"){
        sortName = "price";
        typeSort = rawSort
      }
      const products = await sequelize.query(
        `SELECT *, price * (1-discount/100) as special_price FROM product
        WHERE title LIKE :keyword
        ORDER BY ${sortName} ${typeSort}
        LIMIT :limit
        OFFSET :skip
      `,
        {
          replacements: {
            keyword: keyword,
            limit: objectPanigation.limitItems,
            skip: objectPanigation.skipItems || 0,
            typeSort: typeSort
          },
          type: QueryTypes.SELECT,
        }
      );
      //END truy vấn.

      //Lọc qua để lấy ảnh đầu tiên
      if (products.length > 0) {
        for (const item of products) {
          item["image"] = JSON.parse(item["images"])[0];
          item["special_price"] = parseInt(item["special_price"]);
        }
      }
      //END lọc
      //End phân trang tìm kiếm BE;
      res.render("client/pages/search/index", {
        title: "Tìm kiếm",
        products: products,
        objectPanigation: objectPanigation,
        sort: typeSort
      });
    }
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};
