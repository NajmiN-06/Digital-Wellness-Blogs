"use server";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function joinCommunity(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    contact: formData.get("contact") as string,
    status: formData.get("status") as string,
    about: formData.get("about") as string,
    whyJoin: formData.get("whyJoin") as string,
  };

  await prisma.communityMember.create({ data });
  revalidatePath("/community");
}

export async function getMembers() {
  return await prisma.communityMember.findMany({
    orderBy: { createdAt: 'desc' }
  });
}