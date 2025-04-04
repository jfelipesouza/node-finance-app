import { Request, Response, NextFunction } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@utils/jwt";
import { prisma } from "@utils/database/prisma-connection";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Access token not found",
      error: {
        status: true,
        code: 104,
      },
    });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findFirst({
      where: { email: decoded.email },
      select: {
        profile: {
          select: { account_type: true },
        },
      },
    });
    if (user) {
      req.user = user;
    } else {
      throw new Error();
    }

    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      const refreshToken = req.headers["x-refresh-token"] as string;

      if (!refreshToken) {
        res.status(401).json({
          message: "Token expired. refresh token not exist",
          error: {
            status: true,
            code: 105,
          },
        });
        return;
      }

      try {
        const decodedRefresh = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({
          id: (decodedRefresh as any).id,
        });
        res.setHeader("x-access-token", newAccessToken);

        const user = await prisma.user.findFirst({
          where: { email: decodedRefresh.email },
          select: {
            profile: {
              select: { account_type: true },
            },
          },
        });
        if (user) {
          req.user = user;
        } else {
          throw new Error();
        }
        return next();
      } catch {
        res.status(403).json({
          message: "Refresh token invalid",
          error: {
            status: true,
            code: 106,
          },
        });
        return;
      }
    } else {
      res.status(403).json({
        message: "Token invalid",
        error: {
          status: true,
          code: 107,
        },
      });
      return;
    }
  }
};
