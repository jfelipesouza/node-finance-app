import { Request, Response, Router } from "express";
import { authenticate } from "@middleware/authMiddleware";

const authRoutes = Router();

authRoutes.get("/teste", authenticate, (req: Request, res: Response) => {
  res.send({
    message: "Is autenticated",
    error: {
      status: false,
      code: 0,
    },
  });
});

export { authRoutes };
