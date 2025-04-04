import { Router } from "express";
import type { Request, Response } from "express";

import { signinRouters } from "./signin";
import { authRoutes } from "./auth";
import { allErrors } from "../utils/errors";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Ok",
  });
});

router.use("/signin-bff", signinRouters);
router.use("/auth", authRoutes);

router.post("/errors", (req: Request, res: Response) => {
  const { type } = req.body;

  const errors = allErrors({ filter: type });
  res.status(200).send({ errors: errors });
});

export { router };
