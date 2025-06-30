import { Request, Response, NextFunction } from "express";

export const register = (req: Request, res: Response, next: NextFunction) => {
  const { fullname, email, password, confirmPassword } = req.body;

  // Kiểm tra điều kiện
  if (!fullname || !email || !password || !confirmPassword ) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin!");
    return res.redirect("/users/register");
  };
  if(password !== confirmPassword){
    req.flash("error", "Xác nhận mật không không hợp lệ!");
    return res.redirect("/users/register");
  }
  next();
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body;

  // Kiểm tra điều kiện
  if (!email || !password ) {
    req.flash("error", "Vui lòng điền đầy đủ thông tin!");
    return res.redirect("/users/login");
  };
  next();
};

export const forgetPassword = (req:Request, res:Response, next:NextFunction) => {
  const email:String = req.body.email;
  if(!email){
    req.flash("error", "Vui lòng nhập đầy đủ thông tin!");
    return res.redirect("/users/password/forget");
  };
  next();
}


export const validateOtp = (req:Request, res:Response, next:NextFunction) => {
  if(!req.body.otp || !req.body.email){
    req.flash("error", "Vui lòng điền đầy đủ thông tin!");
    return res.redirect("/users/password/forget");
  };
  next();
}

export const validateResetPassword = (req:Request, res:Response, next:NextFunction) => {
  if(!req.body.password || !req.body.confirmPassword){
    req.flash("error", "Vui lòng nhập đầy đủ thông tin!");
    return res.redirect("/users/password/reset");
  };
  if(req.body.password !== req.body.confirmPassword){
    req.flash("error", "Xác nhận mật khẩu không trùng khớp!");
    return res.redirect("/users/password/reset");
  };
  next();
}