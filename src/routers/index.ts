import { Router } from "express";
import type { Request, Response } from "express";

import { signinRouters } from "./signin";
import { authRoutes } from "./auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Ok",
  });
});

router.use("/signin-bff", signinRouters);
router.use("/auth", authRoutes);

export { router };
