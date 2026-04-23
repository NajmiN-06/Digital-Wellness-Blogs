"use client";
import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

interface EditPostProps {
  postId: string;
  variant?: "button" | "menuItem";
  onAction?: () => void; // To close the menu after clicking
}

export default function EditPostButton({ postId, variant = "button", onAction }: EditPostProps) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAction) onAction(); // Close dropdown if applicable
    router.push(`/write?edit=${postId}`);
  };

  if (variant === "menuItem") {
    return (
      <button 
        onClick={handleEdit}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 text-[#1E302A]"
      >
        <Edit2 size={14} /> Edit
      </button>
    );
  }

  return (
    <button
      onClick={handleEdit}
      className="flex items-center gap-2 px-6 py-2 rounded-full border border-[#234F1E] text-[#234F1E] font-bold hover:bg-[#234F1E] hover:text-[#F2F0E8] transition-all text-sm uppercase tracking-widest"
    >
      <Edit2 size={16} />
      Edit Post
    </button>
  );
}