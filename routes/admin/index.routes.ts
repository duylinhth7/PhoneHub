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
import authorization from "../../middleware/admin/authorization.middleware";

const PATH_ADMIN = systemConfig.prefixAdmin;
export const routesAdmin = (app: Express) => {
    app.use(PATH_ADMIN + "/auth", authRouter);
    app.use(adminMiddleware.authAdmin);
    app.use(PATH_ADMIN  + "/dashboard", dashboardRoute);
    app.use(PATH_ADMIN + "/products", authorization("seller"), productsRoute)
    app.use(PATH_ADMIN + "/categories", authorization("seller"), categoriesRoute)
    app.use(PATH_ADMIN + "/orders", ordersRoute)
    app.use(PATH_ADMIN + "/role", authorization("admin"), roleRoute)
    app.use(PATH_ADMIN + "/accounts", accountsRoute)
}