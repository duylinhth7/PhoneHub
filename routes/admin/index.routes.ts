import { Express } from "express";
import { systemConfig } from "../../config/system";
import { dashboardRoute } from "./dashboard.routes";
import { productsRoute } from "./products.routes";
import { categoriesRoute } from "./categories.routes";
import { ordersRoute } from "./orders.routes";
import { roleRoute } from "./role.routes";
import * as adminMiddleware from "../../middleware/admin/admin.middleware";
import { authRouter } from "./auth.routes";
import { accountsRoute } from "./accounts.routes";

const PATH_ADMIN = systemConfig.prefixAdmin;
export const routesAdmin = (app: Express) => {
    app.use(PATH_ADMIN + "/auth", authRouter);
    app.use(adminMiddleware.authAdmin);
    app.use(PATH_ADMIN  + "/dashboard", dashboardRoute);
    app.use(PATH_ADMIN + "/products", productsRoute)
    app.use(PATH_ADMIN + "/categories", categoriesRoute)
    app.use(PATH_ADMIN + "/orders", ordersRoute)
    app.use(PATH_ADMIN + "/role", roleRoute)
    app.use(PATH_ADMIN + "/accounts", accountsRoute)
}