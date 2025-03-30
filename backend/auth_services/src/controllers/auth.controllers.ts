
  import { Request, Response } from "express"
  import { userInfo } from "os"

  export const register = async (req: Request, res: Response): Promise<void> => {

    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      res.status(200).json({user: {name, email}, message: "User info"})

    } catch (err) {
      console.error("Error registering user:", err)
      res.status(500).json({ message: "Internal server error" });
    }

  }