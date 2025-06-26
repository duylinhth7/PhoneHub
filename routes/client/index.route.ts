import { Express } from "express";
import { usersRoute } from "./users.route";
import { homeRoute } from "./home.route";
import { authentication } from "../../middleware/client/authen.middleware";

export const routesClient = (app: Express) => {
    app.use(authentication)
    app.use("/", homeRoute)
    app.use("/users", usersRoute);
}