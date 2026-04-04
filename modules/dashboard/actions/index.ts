"use server";
import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { is } from "date-fns/locale";
import { revalidatePath } from "next/cache";

export const getAllPlaygroundsOfUser = async () => {
  const user = await currentUser();
  try {
    const playgrounds = await db.playground.findMany({
      where: { userId: user?.id },
      include: {
        user: true,
        Starmark: {
          where: { userId: user?.id },
          select: { isMarked: true },
        },
      },
    });

    return playgrounds;
  } catch (error) {
    console.error("Error fetching playgrounds", error);
  }
};

export const createPlayground = async (data: {
  title: string;
  template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
  description?: string;
}) => {
  const user = await currentUser();
  const { title, template, description } = data;
  try {
    const newPlayground = await db.playground.create({
      data: {
        title: title,
        template: template,
        description: description,
        userId: user?.id!,
      },
    });

    return newPlayground;
  } catch (error) {
    console.error("Error creating playground", error);
  }
};

export const deletePlaygroundById = async (id: string) => {
  try {
    await db.playground.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error deleting playground", error);
  }
};

export const updatePlaygroundById = async (
  id: string,
  data: { title?: string; description?: string },
) => {
  const { title, description } = data;
  try {
    await db.playground.update({
      where: { id },
      data: { title, description },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error updating playground", error);
  }
};

export const duplicatePlaygroundById = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
      // todo
    });
    if (!originalPlayground) {
      throw new Error("Playground not found");
    }
    const duplicatedPlayground = await db.playground.create({
      data: {
        title: originalPlayground.title + " (Copy)",
        template: originalPlayground.template,
        description: originalPlayground.description,
        userId: originalPlayground.userId,
      },
    });
    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.error("Error duplicating playground", error);
  }
};

export const toggleStarMarked = async (id: string, isMarked: boolean) => {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    if (isMarked) {
      await db.starMark.create({
        data: {
          userId,
          playgroundId: id,
          isMarked,
        },
      });
    } else {
      await db.starMark.delete({
        where: {
          userId_playgroundId: {
            userId,
            playgroundId: id,
          },
        },
      });
    }
    revalidatePath("/dashboard");
    return { success: true, isMarked };
  } catch (error) {
    console.error("Error toggling star mark", error);
    return { success: false, error, isMarked: !isMarked };
  }
};
