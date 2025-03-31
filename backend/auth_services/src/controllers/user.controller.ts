
import { Request, Response } from "express"

export const getMe = (req: Request, res: Response): void => {

  const user = req.user;

  res.status(200).json({
    message: "Authenticated user",
    user
  });
};
