import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type PrismaParam = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;

const createUserUsingSupabase = async (
  prisma: PrismaParam,
  form: {
    email: string;
    username: string;
  }
) => {
  const { email, username } = form;
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
  prisma: PrismaParam,
  form: { email: string; username: string; password: string }
) => {
  const { email, password, username } = form;
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

const checkProfile = async (
  prisma: PrismaParam,
  user: { userId: number; name: string }
) => {
  const profile = await prisma.profile.findFirst({
    where: { user_id: user.userId },
  });
  if (!profile) {
    await prisma.profile.create({
      data: {
        id: user.userId,
        user_id: user.userId,
        name: user.name,
      },
    });
  }
};

export { checkProfile, createUser, createUserUsingSupabase };
