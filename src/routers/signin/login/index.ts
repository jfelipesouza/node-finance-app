import type { Request, Response } from "express";
import { prisma } from "../../../utils/database/prisma-connection";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as {
    email: string | undefined;
    password: string | undefined;
  };

  if (email && password) {
    if (typeof email === "string" && typeof password === "string") {
      const user = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      res.send({ ...user });
    }
  }
  res.send({ message: "OK" });
};
