import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "@utils/jwt";
import { Request, Response, NextFunction } from "express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token not found" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    console.log({ decoded });
    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      const refreshToken = req.headers["x-refresh-token"] as string;

      if (!refreshToken) {
        res
          .status(401)
          .json({ message: "Token expired. refresh token not exist" });
        return;
      }

      try {
        const decodedRefresh = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({
          id: (decodedRefresh as any).id,
        });
        res.setHeader("x-access-token", newAccessToken);
        req.user = decodedRefresh;
        return next();
      } catch {
        res.status(403).json({ message: "Refresh token invalid" });
        return;
      }
    } else {
      res.status(403).json({ message: "Token invalid" });
      return;
    }
  }
};
