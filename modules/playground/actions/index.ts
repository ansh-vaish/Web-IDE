"use server";

import { db } from "@/lib/db";
import { TemplateFolder } from "../lib/path-to-json";
import { currentUser } from "@/modules/auth/actions";

export const getPlaygroundById = async (id: string) => {
  const user = await currentUser();
  if (!user?.id) {
    return {
      success: false,
      error: "UNAUTHENTICATED",
      data: null,
    };
  }

  try {
    const playground = await db.playground.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        title: true,
        templateFiles: {
          select: {
            content: true,
          },
        },
      },
    });

    if (!playground) {
      return {
        success: false,
        error: "PRIVATE_PLAYGROUND",
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: playground,
    };
  } catch (error) {
    console.error("Error fetching playground:", error);
    return {
      success: false,
      error: "FETCH_ERROR",
      data: null,
    };
  }
};

export const SaveUpdatedCode = async (
  playgroundId: string,
  data: TemplateFolder,
) => {
  const user = await currentUser();
  if (!user) return null;

  try {
    const updatedPlayground = await db.templateFile.upsert({
      where: {
        playgroundId,
      },
      update: {
        content: JSON.stringify(data),
      },
      create: {
        playgroundId,
        content: JSON.stringify(data),
      },
    });

    return updatedPlayground;
  } catch (error) {
    console.log("SaveUpdatedCode error:", error);
    return null;
  }
};
