"use server";
import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * FETCH SAVED POSTS
 * Used for the "My List" functionality
 */
export async function getSavedPosts(savedIds: string[]) {
  if (!savedIds || savedIds.length === 0) return [];
  
  try {
    return await prisma.post.findMany({
      where: {
        id: { in: savedIds }
      },
      include: { tags: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Failed to fetch saved posts:", error);
    return [];
  }
}

/**
 * SAVE / UPDATE POST
 * Handles create vs update and tag logic
 */
export async function savePost(formData: FormData, tags: string[], id?: string | null) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorName = formData.get("authorName") as string;
  const authorEmail = formData.get("authorEmail") as string;

  const tagLogic = {
    connectOrCreate: tags.map(name => ({
      where: { name },
      create: { name }
    }))
  };

  if (id) {
    // UPDATE
    await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        authorName,
        authorEmail,
        tags: {
          set: [], // Clear old tags
          ...tagLogic
        }
      },
    });
  } else {
    // CREATE
    await prisma.post.create({
      data: {
        title,
        content,
        authorName,
        authorEmail,
        tags: tagLogic
      },
    });
  }

  revalidatePath("/");
  redirect("/");
}

/**
 * FETCH SINGLE POST
 */
export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

/**
 * DELETE POST
 */
export async function deletePost(id: string) {
  try {
    // Disconnect tags first
    await prisma.post.update({
      where: { id },
      data: { tags: { set: [] } },
    });

    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    // Important: Throw for the toast.promise to catch it
    throw new Error("Failed to delete post");
  }
}

/**
 * GET ALL POSTS
 */
export async function getAllPosts() {
  try {
    return await prisma.post.findMany({
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

/**
 * SEARCH POSTS
 */
export async function searchPosts(query: string) {
  if (!query) return [];
  try {
    return await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { some: { name: { contains: query, mode: 'insensitive' } } } }
        ]
      },
      include: { tags: true }
    });
  } catch (error) {
    console.error("Search Error:", error);
    return [];
  }
}