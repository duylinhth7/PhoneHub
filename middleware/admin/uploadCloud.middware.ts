import {Request, Response, NextFunction } from "express";
import { uploadToCloud } from "../../helpers/uploadToCloud";
export const uploadSingle = async (req:Request, res:Response, next:NextFunction) => {
    if (req["file"]) {
        const link = await uploadToCloud(req["file"].buffer);
        req.body[req["file"].fieldname] = link;
    } else {
    }
    next();
}

export const uploadFields = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    for (const key in req["files"]) {
      const links = [];
      for (const item of req["files"][key]) {
        try {
          const link = await uploadToCloud(item.buffer);
          links.push(link);
        } catch (error) {
          console.log(error);
        }
      }
      req.body[key] = links;
    }
    next();
  }