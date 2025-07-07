import { Express } from "express";
import { systemConfig } from "../../config/system";
import { dashboardRoute } from "./dashboard.routes";
import { productsRoute } from "./products.routes";
import { categoriesRoute } from "./categories.routes";
import { ordersRoute } from "./orders.routes";

const PATH_ADMIN = systemConfig.prefixAdmin;
export const routesAdmin = (app: Express) => {
    app.use(PATH_ADMIN  + "/dashboard", dashboardRoute);
    app.use(PATH_ADMIN + "/products", productsRoute)
    app.use(PATH_ADMIN + "/categories", categoriesRoute)
    app.use(PATH_ADMIN + "/orders", ordersRoute)
}