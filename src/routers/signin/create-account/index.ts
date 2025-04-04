import type { Request, Response } from "express";

import { prisma } from "../../../utils/database/prisma-connection";
import {
  checkProfile,
  createUser,
  createUserUsingSupabase,
} from "../../../services/create-account";

export const createAccount = async (req: Request, res: Response) => {
  const { username, password, email, type, userInfo } = req.body;

  if (!username || !email) {
    res.status(400).send({
      message: "Invalid credentials",
      error: true,
    });
    return;
  }
  if (type !== "supabase" && !password) {
    res.status(400).send({
      message: "Invalid credentials",
      error: true,
    });
    return;
  }

  const userAlreadyExist = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
    select: { createAt: true },
  });

  if (userAlreadyExist) {
    res.status(409).send({
      message: "User already exist",
      error: true,
    });
    return;
  }

  if (type === "supabase") {
    const user = await createUserUsingSupabase(prisma, { email, username });
    await checkProfile(prisma, { name: userInfo.name, userId: user.id });
  } else {
    const user = await createUser(prisma, { email, username, password });
    await checkProfile(prisma, { name: userInfo.name, userId: user.id });
  }

  res.status(201).send({ message: "Account created", error: false });
};
