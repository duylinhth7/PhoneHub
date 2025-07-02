import { Express } from "express";
import { usersRoute } from "./users.route";
import { homeRoute } from "./home.route";
import { authentication } from "../../middleware/client/authen.middleware";
import { cleanExpiredOtp } from "../../middleware/client/cleanExpiredOtp.middleware";
import { productsRoute } from "./products.route";
import { cartRoute } from "./cart.route";
import { orderRoute } from "./order.route";

export const routesClient = (app: Express) => {
    app.use(authentication);
    app.use(cleanExpiredOtp);
    app.use("/", homeRoute);
    app.use("/users", usersRoute);
    app.use("/products", productsRoute)
    app.use("/cart", cartRoute);
    app.use("/order", orderRoute);
}