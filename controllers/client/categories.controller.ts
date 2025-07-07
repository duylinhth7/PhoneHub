import { Request, Response } from "express";
import Categories from "../../models/categories.model";
import Product from "../../models/product.model";
import panigationHelper from "../../helpers/panigation";
import { raw } from "mysql2";
// [GET] /categories
export const index = async (req: Request, res: Response) => {
  try {
    const categories = await Categories.findAll({
      where: {},
      raw: true,
    });
    // console.log(cateogries)
    res.render("client/pages/categories/index", {
      title: "Danh mục",
      categories: categories,
    });
  } catch (error) {
    console.log("Lỗi!", error);
  }
};

// [GET] /categories/detail/:slug
export const detail = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    const category = await Categories.findOne({
      where: {
        slug: slug,
      },
      raw: true,
    });

    //Phân trang BACKEND
    const count = await Product.count({
      where: { deleted: false, categoryId: category["id"] },
    });
    const objectPanigation = panigationHelper(
      {
        currentPage: 1,
        limitItems: 8,
      },
      req.query,
      count
    );
    //END phân trang BE;
    let where = {
      categoryId: category["id"],
    };

    //Phần SORT theo giá
    let typeSort = "createdAt";
    let sort = "DESC";
    if (req.query.sort && req.query.sort !== "createdAt") {
      typeSort = "price";
      sort = req.query.sort;
    } else {
        typeSort = "createdAt"
    }
    //END SORT theo giá
    const products = await Product.findAll({
      where: where,
      limit: objectPanigation.limitItems,
      offset: objectPanigation.skipItems || 0,
      order: [[typeSort, sort]],
      raw: true,
    });
    if (products) {
      for (const item of products) {
        item["image"] = JSON.parse(item["images"])[0];
        item["special_price"] = item["price"] * (1 - item["discount"] / 100);
      }
    }
    res.render("client/pages/categories/detail", {
      title: `Danh mục - ${category["title"].toUpperCase()}`,
      products: products,
      category: category,
      objectPanigation: objectPanigation,
      typeSort,
      sort,
    });
  } catch (error) {
    console.log("Lỗi", error);
  }
};
