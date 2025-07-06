import express, {Express, Request, Response, NextFunction} from "express";
import sequelize from "./config/database";
import dotenv from "dotenv"
import bodyParser from "body-parser"
import mothodOverride from "method-override";
import session from 'express-session';
import flash from 'connect-flash';
import path from "path";
import cookieParser from "cookie-parser";
import { routesClient } from "./routes/client/index.route";
import { routesAdmin } from "./routes/admin/index.routes";
import { systemConfig } from "./config/system";


dotenv.config();
const app :Express = express();
const port :Number | String = process.env.PORT || 3000;
sequelize;

app.use(cookieParser())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
// parse application/json
app.use(bodyParser.json())
app.set('views', `${__dirname}/views`); // Tìm đến thư mục tên là views
app.set('view engine', 'pug'); // template engine sử dụng: pug
app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh
app.use(mothodOverride("_method"));
app.use(flash());
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.prefixAdmin = systemConfig.prefixAdmin

//Session & Flash

// Middleware cho session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
// Flash message middleware
// Gửi flash message tới view
app.use((req:Request, res:Response, next:NextFunction) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

//End Session & Flash

//Router Client & ADMIN
routesClient(app);
routesAdmin(app);
//End router client & ADMIN


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})