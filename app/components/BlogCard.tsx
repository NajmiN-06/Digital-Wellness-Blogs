"use client";
import Link from 'next/link'; // Import the Link component
import { useState } from 'react';
import { deletePost } from '../actions/posts';
import { MoreVertical, Edit2, Trash2, Tag as TagIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { useReadingList } from '../store/useReadingList';
import EditPostButton from './EditPost';

// 2. Ensure you have 'export default' here

export default function BlogCard({ post }: { post: any }) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const { moveToTrash } = useReadingList();
  const { savedIds, toggleSave } = useReadingList();
  const handleEdit = () => {
    // Navigate to the write page but pass the ID or data
    // Usually: /write?edit=ID
    router.push(`/write?edit=${post.id}`);
  };

  const handleDelete = () => {
    if (confirm("Move this blog to trash?")) {
      moveToTrash(post);
      // Here you would also call a Server Action to delete from Prisma
      // deletePost(post.id); 
      alert("Blog moved to your session trash array.");
    }
  };
  return (
    <Link href={`/blog/${post.id}`} className="block">
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-[#234F1E]/5 hover:shadow-xl transition-all duration-300">
        <div>
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();   // Stops the Link from following the URL
                e.stopPropagation(); // Stops the click from "bubbling up" to the card
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            >
              <MoreVertical size={18} className="text-[#234F1E]/60" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-20">
                <EditPostButton 
      postId={post.id} 
      variant="menuItem" 
      onAction={() => setShowMenu(false)} 
    />
              <button 
  onClick={async (e) => {
    e.preventDefault();
    e.stopPropagation(); // VERY IMPORTANT: Stops the card click
    
    if (confirm("Are you sure you want to delete this blog?")) {
      const result = await deletePost(post.id);
      
      if (result.success) {
        // Optional: you can also call your Zustand trash logic here
        // moveToTrash(post); 
        setShowMenu(false);
      } else {
        alert("Failed to delete the post.");
      }
    }
  }}
  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-50 text-red-600"
>
  <Trash2 size={14} /> Delete
</button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags?.map((tag: any, index: number) => (
              <span
                key={tag.id}
                className={`${index % 2 === 0 ? "bg-[#A0AF8E]" : "bg-[#929292]"
                  } text-white px-3 py-1 rounded-full text-[10px] font-bold`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-[#234F1E]">
            {post.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-[#234F1E]/70 line-clamp-3">
            {post.content}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#234F1E]/10 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#234F1E] flex items-center justify-center text-[#F2F0E8] text-xs font-bold">
              {post.authorName.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-[#234F1E]">{post.authorName}</span>
          </div>
          <div className="flex items-flex-end justify-end gap-2">
            <span className="text-[15px] font-medium text-[#234F1E]/40 uppercase tracking-tighter">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevents the click from navigating to the blog detail page
                e.stopPropagation(); // Prevents event bubbling
                toggleSave(post.id);
              }}
              className="p-1.5 rounded-full hover:bg-[#234F1E]/5 transition-colors group/bookmark"
              aria-label="Bookmark post"
            >
              <Bookmark
                size={16}
                className={`transition-all duration-300 ${savedIds.includes(post.id)
                    ? "fill-[#234F1E] text-[#234F1E]" // Saved State: Filled Dark Green
                    : "text-[#234F1E]/30 group-hover/bookmark:text-[#234F1E]" // Unsaved State: Faded Outline
                  }`}
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}