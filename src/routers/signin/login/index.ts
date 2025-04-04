import type { Request, Response } from "express";
import { prisma } from "@utils/database/prisma-connection";
import { generateAccessToken, generateRefreshToken } from "@utils/jwt";

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
        select: {
          email: true,
          profile: {
            select: {
              createAt: true,
            },
          },
        },
      });
      if (user) {
        const access_token = generateAccessToken(user);
        const refresh_token = generateRefreshToken(user);
        res.status(200).send({
          error: {
            status: false,
            code: 0,
          },
          message: "Success in login",
          access_token,
          refresh_token,
        });
        return;
      }
      res.status(404).send({
        message: "User not exist",
        error: { status: true, code: 102 },
      });
      return;
    }
  }
  res
    .status(500)
    .send({ message: "Failed in login", error: { status: true, code: 103 } });
};
