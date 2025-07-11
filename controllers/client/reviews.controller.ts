import {Request, Response} from "express";
import Reviews from "../../models/reviews.model";

// [POST] /reviews/add
export const addReview = async (req:Request, res:Response) => {
    try {
        const user = res.locals.user;
        if(!user){
            return res.status(400).json({
                message: "Vui lòng đăng nhập trước!"
            });
        };
        const newReview = {
            rating: parseInt(req.body.rating),
            comment: req.body.comment,
            userId:  parseInt(user["userId"]),
            productId: parseInt(req.body.productId)
        };
        try {
            const review = await Reviews.create(newReview);
            res.status(200).json({
                message: "Tạo đánh giá thành công!",
                review: review
            })
        } catch (error) {
            console.log(error)
            res.status(400).json({
                message: "Tạo đánh giá thất bại!"
            })
        }
    } catch (error) {
        console.log("Lỗi: ", error)
        res.status(400).message("Lỗi: ", error)
    }
}

//[DELETE] /review/delete
export const deleteReview = async (req:Request, res:Response) => {
    try {
        const id = req.params.id;
        await Reviews.destroy({
            where: {
                id: id
            }
        });
        return res.status(200).json({
            message: "Xóa thành công!"
        })
    } catch (error) {
        console.log("Lỗi: ", error)
        res.status(400).json({
            message: "Lỗi!"
        })
    }
}