import { Request, Response } from "express";
import Product from "../../models/product.model";
import sequelize from "../../config/database";
import { Op, QueryTypes } from "sequelize";
import slugify from "slugify";
import { systemConfig } from "../../config/system";
import panigationHelper from "../../helpers/panigation";
import Categories from "../../models/categories.model";

const PATH_ADMIN = systemConfig.prefixAdmin;
// [GET] /admin/products
export const index = async (req: Request, res: Response) => {
  try {
    let where = {deleted: false};
    //Phân trang BACKEND
    const countProduct = await Product.count({
      where: {deleted: false}
    });
    const objectPanigation = panigationHelper(
      {
        currentPage: 1,
        limitItems: 3,
      },
      req.query,
      countProduct
    );
    //END phân trang BE;

    //Phần tìm  kiếm
    if (req.query.search) {
      const title = req.query.search;
      where["title"] = {
        [Op.regexp]: title,
      };
    }
    //End phần tìm kiếm
    const products = await Product.findAll({
      where: where,
      order: [["createdAt", "DESC"]],
      limit: objectPanigation.limitItems,
      offset: objectPanigation.skipItems || 0,
      raw: true,
    });
    for (const item of products) {
      item["image"] = JSON.parse(item["images"])[0];
    }
    res.render("admin/pages/products/index", {
      title: "Danh sách sản phẩm",
      products: products,
      objectPanigation: objectPanigation,
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

//[GET] /admin/create
export const create = async (req: Request, res: Response) => {
  const categories = await sequelize.query(`SELECT id, title FROM categories`, {
    type: QueryTypes.SELECT,
  });
  res.render("admin/pages/products/create", {
    title: "Tạo mới sản phẩm",
    categories: categories,
  });
};

//[POST] /admin/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      title,
      price,
      discount,
      stock,
      imagesFiles,
      imageUrls,
      description,
      featured,
      categoryId,
      tskt_name,
      tskt_value
    } = req.body;
    //Xử lý logic tskt
    let tskt = [];
    if(tskt_name.length > 0 && tskt_value.length > 0){
      tskt_name.map((_, index) => {
        const newTskt = {
          name: tskt_name[index],
          value: tskt_value[index]
        };
        tskt.push(newTskt)
      })
    }
    //End xử lý logic tskt
    const position = await Product.count();
    const slug = slugify(`${title}-${Date.now()}`, {
      replacement: "-",
      lower: true,
      strict: true,
    });
    const images = imagesFiles ? JSON.stringify(imagesFiles) : imageUrls;
    const newProduct = {
      title,
      price: parseInt(price),
      discount: parseInt(discount),
      stock: parseInt(stock),
      images,
      description,
      categoryId,
      featured: featured === "true",
      slug,
      position: position + 1,
      tskt: JSON.stringify(tskt)
    };

    //Kiểm tra xem trong DB có sp nào trùng tên không?
    const exitsProduct = await Product.findOne({
      where: { title: title },
    });
    if (exitsProduct) {
      req.flash("error", "Tên sản phẩm trùng với một sản phẩm đã tạo trước đó");
      return res.redirect(PATH_ADMIN + "/products/create");
    } else {
      await Product.create(newProduct);
      req.flash("success", "Tạo sản phẩm mới thành công!");
      return res.redirect(PATH_ADMIN + "/products");
    }
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

//[GET] /admin/products/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const product = await Product.findOne({
      where: { id: id },
      raw: true,
    });
    const categories = await Categories.findAll({
      where: {},
      raw: true,
    });
    product["images"] = JSON.parse(product["images"]);
    product["tskt"] = JSON.parse(product["tskt"])
    res.render("admin/pages/products/detail", {
      title: "Chi tiết sản phẩm",
      product: product,
      categories: categories,
    });
  } catch (error) {
    console.log("Lỗi: ", error);
  }
};

//[POST] /admin/products/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const {
      title,
      price,
      discount,
      stock,
      imagesFiles,
      imageUrls,
      description,
      featured,
      tskt_name,
      tskt_value,
      categoryId,
    } = req.body;

        //Xử lý logic tskt
    let tskt = [];
    if(tskt_name.length > 0 && tskt_value.length > 0){
      tskt_name.map((_, index) => {
        const newTskt = {
          name: tskt_name[index],
          value: tskt_value[index]
        };
        tskt.push(newTskt)
      })
    }
    //End xử lý logic tskt

    const images = imageUrls
      .split("\r\n")
      .map((url) => url.trim())
      .filter(Boolean);
    if (imagesFiles) {
      for (const item of imagesFiles) {
        images.push(item);
      }
    }
    const editProduct = {
      title,
      price: parseInt(price),
      discount: parseInt(discount),
      stock: parseInt(stock),
      images: JSON.stringify(images),
      description,
      categoryId,
      tskt: JSON.stringify(tskt),
      featured: featured === "true",
    };
    await Product.update(editProduct, {
      where: { id: id },
    });
    req.flash("success", "Cập nhật thành công!");
    res.redirect(PATH_ADMIN + `/products/detail/${id}`);
  } catch (error) {
    console.log(error);
  }
};

//[DELETE] /admin/products/delete/:id;
export const deleteProduct = async (req:Request, res:Response) => {
  try {
    const id:string = req.params.id;
    await Product.update({deleted: true}, {
      where: {id: id}
    });
    req.flash("success", "Xóa mềm sản phẩm thành công!");
    return res.redirect(PATH_ADMIN + "/products");
  } catch (error) {
    console.log("Lỗi: ", error);
  }
}