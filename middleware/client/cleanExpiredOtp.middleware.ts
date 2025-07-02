// middleware/cleanExpiredOtp.middleware.ts
import { Request, Response, NextFunction } from "express";
import sequelize from "../../config/database";
import ForgetPassword from "../../models/forget-password.model";
export const cleanExpiredOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await ForgetPassword.count();
    if (count > 0) {
      await sequelize.query(
        "DELETE FROM forget_password WHERE expiresAt < NOW()"
      );
    }
  } catch (error) {
    console.error("Lỗi khi xóa OTP hết hạn:", error);
    // Không dừng request chính nếu lỗi
  }

  next();
};
