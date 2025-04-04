import type { Request, Response } from "express";

import { prisma } from "../../../utils/database/prisma-connection";

const createUserUsingSupabase = async (email: string, username: string) => {
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      username: username,
      password: "",
    },
  });
  return user;
};

const createUser = async (
  email: string,
  username: string,
  password: string
) => {
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      username: username,
      password: password,
    },
  });
  return user;
};

const checkProfile = async (userId: number, name: string = "") => {
  const profile = await prisma.profile.findFirst({
    where: { user_id: userId },
  });
  if (!profile) {
    await prisma.profile.create({
      data: {
        id: userId,
        user_id: userId,
        name,
      },
    });
  }
};

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
  });

  if (userAlreadyExist) {
    res.status(409).send({
      message: "User already exist",
      error: true,
    });
    return;
  }

  if (type === "supabase") {
    const user = await createUserUsingSupabase(email, username);
    await checkProfile(user.id, userInfo.name);
  } else {
    const user = await createUser(email, username, password);
    await checkProfile(user.id);
  }

  res.status(201).send({ message: "Account created", error: false });
};
