import { Request, Response } from "express";
import Categories from "../../models/categories.model";
import panigationHelper from "../../helpers/panigation";
import { systemConfig } from "../../config/system";
import sequelize from "../../config/database";
import { QueryTypes } from "sequelize";

const PATH_ADMIN = systemConfig.prefixAdmin;
// [GET] /admin/categories
export const index = async (req: Request, res: Response) => {
  try {
    //Phân trang BACKEND
    const count = await Categories.count({
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
    const categories = await Categories.findAll({
      where: { deleted: false },
      raw: true,
      limit: objectPanigation.limitItems,
      offset: objectPanigation.skipItems || 0,
      order: [["createdAt", "DESC"]],
    });
    res.render("admin/pages/categories/index", {
      title: "Danh mục sản phẩm",
      categories: categories,
      objectPanigation: objectPanigation,
    });
  } catch (error) {
    console.log("Lỗi:", error);
  }
};
// [GET] /admin/categories/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/categories/create", {
    title: "Tạo danh mục sản phẩm",
  });
};

// [POST] /admin/categories/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const exitsCategories = await Categories.findOne({
      where: {
        title: req.body.title,
      },
    });
    if (exitsCategories) {
      req.flash("error", "Tên danh mục này đã tồn tại");
      return res.redirect(PATH_ADMIN + "/categories/create");
    }
    const count = await Categories.count({});
    const slug = `${req.body.title}-${Date.now()}`;
    const image = req.body.imageFile ? req.body.imageFile : req.body.imageUrl;
    const newCategory = {
      title: req.body.title,
      description: req.body.description,
      image: image,
      position: count + 1,
      slug: slug,
    };
    await Categories.create(newCategory);
    req.flash("success", "Tạo danh mục mới thành công!");
    return res.redirect(PATH_ADMIN + "/categories");
  } catch (error) {
    console.log("Lỗi: ", error);
    req.flash("error", "Lỗi");
    return res.redirect(PATH_ADMIN + "/categories");
  }
};

//[GET] /admin/categories/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const category = await Categories.findOne({
      where: { id: id },
      raw: true,
    });
    res.render("admin/pages/categories/detail", {
      title: "Chi tiết sản phẩm",
      category: category,
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

//[PATCH] /admin/categories/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const image: string = req.body.imageUrl
      ? req.body.imageUrl
      : req.body.imageFile;
    const checkSlugAndTitle = await sequelize.query(
      `SELECT * FROM categories 
       WHERE id != :id AND (slug = :slug OR title = :title)`,
      {
        replacements: {
          slug: req.body.slug,
          title: req.body.title,
          id: id,
        },
        type: QueryTypes.SELECT,
      }
    );
    if (checkSlugAndTitle.length > 0) {
      req.flash("error", "Tên tiêu đề hoặc slug trùng với danh mục khác!");
      return res.redirect(PATH_ADMIN + `/categories/detail/${id}`);
    }
    const updateCategory = {
      title: req.body.title,
      description: req.body.description,
      image: image,
      slug: req.body.slug,
    };
    await Categories.update(updateCategory, {
      where: { id: id },
    });
    req.flash("success", "Cập nhật thành công!");
    return res.redirect(PATH_ADMIN + `/categories/detail/${id}`);
  } catch (error) {
    req.flash("error", "Lỗi");
    return res.redirect(PATH_ADMIN + `/products/categories  `);
  }
};

// [DELETE] /admin/categories/delete/:id
export const deleteCateggory = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Categories.update(
      { deleted: true },
      {
        where: { id: id },
      }
    );
    req.flash("success", "Xóa mềm danh mục thành công!");
    return res.redirect(PATH_ADMIN + "/categories");
  } catch (error) {
    req.flash("error", "Lỗi!");
    return res.redirect(PATH_ADMIN + "/categories");
  }
};
