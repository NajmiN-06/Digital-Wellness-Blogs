"use client";
import React, { useState, useEffect, Suspense } from "react";
import { savePost, getPostById, deletePost } from "../actions/posts";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

// We wrap the internal logic in a component to handle the Suspense boundary
function WriteFormContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // 1. STATE MANAGEMENT
  const [isPreview, setIsPreview] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagName, setTagName] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    authorName: "",
    authorEmail: "",
  });

  // 2. LOAD DATA IF EDITING
  useEffect(() => {
    async function loadPost() {
      if (editId) {
        const post = await getPostById(editId);
        if (post) {
          setFormData({
            title: post.title,
            content: post.content,
            authorName: post.authorName,
            authorEmail: post.authorEmail,
          });
          // Ensure post.tags exists before mapping
          if (post.tags) {
            setTags(post.tags.map((t: any) => t.name));
          }
        }
      }
    }
    loadPost();
  }, [editId]);

  // 3. HANDLERS
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagName.trim()) {
      e.preventDefault();
      const newTags = tagName.split(',').map(t => t.trim()).filter(t => t !== "");
      
      setTags(prev => {
        const combined = [...prev];
        newTags.forEach(t => {
          if (!combined.includes(t)) combined.push(t);
        });
        return combined;
      });
      setTagName("");
    }
  };

  const handlePublish = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();

  if (tags.length === 0) {
    return toast.error("Please add at least one tag.");
  }

  const loadingToast = toast.loading(editId ? 'Updating...' : 'Publishing...');

  try {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("authorName", formData.authorName);
    data.append("authorEmail", formData.authorEmail);

    await savePost(data, tags, editId);

    // If we reach this line, the redirect didn't happen yet (unlikely with redirect)
    toast.success('Success!', { id: loadingToast });

  } catch (error: any) {
    /**
     * NEXT.JS REDIRECT CHECK:
     * We check if the error message contains "NEXT_REDIRECT". 
     * If it does, it means the post was SUCCESSFUL and Next.js is 
     * just trying to move us to the home page.
     */
    if (error.message?.includes("NEXT_REDIRECT")) {
      toast.success(editId ? 'Updated successfully!' : 'Published successfully!', {
        id: loadingToast,
      });
      return; 
    }

    // Actual error handling
    toast.error("Something went wrong. Please check your connection.", {
      id: loadingToast,
    });
    console.error("Publishing error:", error);
  }
};
 const handleDelete = async () => {
  // 1. If no editId, we are just clearing the local draft
  if (!editId) {
    setFormData({ title: "", content: "", authorName: "", authorEmail: "" });
    setTags([]);
    setIsPreview(false);
    toast.success("Draft cleared");
    return;
  }

  // 2. If we have an editId, we proceed with database deletion
  if (confirm("Are you sure you want to permanently delete this post?")) {
    try {
      // Use ! to tell TypeScript editId is definitely a string here
      const deletePromise = deletePost(editId!); 

      await toast.promise(
        deletePromise.then((res) => {
          if (!res.success) throw new Error("Delete failed");
          return res;
        }),
        {
          loading: 'Deleting post from database...',
          success: 'Post deleted successfully!',
          error: 'Could not delete post.',
        },
        {
          style: {
            background: '#234F1E',
            color: '#F2F0E8',
          },
        }
      );

      // Reset UI state after success
      setFormData({ title: "", content: "", authorName: "", authorEmail: "" });
      setTags([]);
      setIsPreview(false);
      
    } catch (error) {
      console.error("Delete operation failed:", error);
    }
  }
};
  // 4. PREVIEW UI
  if (isPreview) {
    return (
      <article className="max-w-4xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {tags.map((t, index) => (
              <span 
                key={t} 
                className={`${
                  index % 2 === 0 ? "bg-[#A0AF8E]" : "bg-[#929292]"
                } text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest`}
              >
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-4 text-[#234F1E]">{formData.title}</h1>
          <p className="opacity-40 uppercase text-xs tracking-widest text-[#234F1E]">Draft Preview</p>
        </div>

        <div className="prose prose-lg max-w-none mb-24">
          <p className="whitespace-pre-line text-xl leading-relaxed opacity-90 text-[#234F1E]">
            {formData.content}
          </p>
        </div>

        <div className="border-t border-[#234F1E]/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <button 
            onClick={handleDelete}
            className="text-red-600 font-bold uppercase text-xs tracking-widest hover:opacity-70 transition-opacity"
          >
            Delete Blog
          </button>

          <div className="flex gap-4">
            <button 
              onClick={() => setIsPreview(false)}
              className="px-8 py-3 rounded-full border border-[#234F1E] font-bold hover:bg-[#234F1E] hover:text-[#F2F0E8] transition-all text-[#234F1E]"
            >
              Edit Blog
            </button>
            <button 
              onClick={handlePublish}
              className="px-8 py-3 rounded-full bg-[#234F1E] text-[#F2F0E8] font-bold shadow-xl hover:scale-105 active:scale-95 transition-transform"
            >
              Publish Blog
            </button>
          </div>
        </div>
      </article>
    );
  }

  // 5. EDITOR UI
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-2 text-[#234F1E]">Create something new</h1>
          <p className="text-sm opacity-60 uppercase tracking-widest font-medium text-[#234F1E]">New Draft • Mindful Tech</p>
        </div>
        <Link href="/" className="text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity text-[#234F1E]">
          ← Back to Home
        </Link>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-[10px] font-bold uppercase mb-6 opacity-30 tracking-[0.2em] text-[#234F1E]">01. Author Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-white/50 rounded-3xl border border-white">
            <div>
              <label className="block text-[10px] font-black uppercase mb-3 opacity-60 tracking-wider text-[#234F1E]">Your Name</label>
              <input 
                value={formData.authorName}
                onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                className="w-full bg-white px-5 py-4 rounded-2xl border border-[#234F1E]/5 focus:outline-none focus:border-[#234F1E]/20 transition-all font-medium placeholder:opacity-30 text-[#234F1E]"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase mb-3 opacity-60 tracking-wider text-[#234F1E]">Email Address</label>
              <input 
                type="email"
                value={formData.authorEmail}
                onChange={(e) => setFormData({...formData, authorEmail: e.target.value})}
                className="w-full bg-white px-5 py-4 rounded-2xl border border-[#234F1E]/5 focus:outline-none focus:border-[#234F1E]/20 transition-all font-medium placeholder:opacity-30 text-[#234F1E]"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase mb-6 opacity-30 tracking-[0.2em] text-[#234F1E]">02. Post Content</h2>
          <div className="space-y-8 p-8 bg-white rounded-3xl shadow-sm border border-[#234F1E]/5">
            <div>
              <label className="block text-[10px] font-black uppercase mb-3 opacity-60 tracking-wider text-[#234F1E]">Title</label>
              <input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-transparent border-b border-[#234F1E]/10 py-4 text-4xl md:text-5xl focus:outline-none focus:border-[#234F1E] transition-colors font-serif italic placeholder:opacity-10 text-[#234F1E]"
                placeholder="Your story title..."
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase mb-3 opacity-60 tracking-wider text-[#234F1E]">Content</label>
              <textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={12}
                className="w-full bg-transparent p-0 focus:outline-none transition-colors resize-none text-xl leading-relaxed font-light placeholder:opacity-20 text-[#234F1E]"
                placeholder="Begin writing here..."
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[10px] font-bold uppercase mb-6 opacity-30 tracking-[0.2em] text-[#234F1E]">03. Tags & Distribution</h2>
          <div className="p-8 bg-white/50 rounded-3xl border border-white">
            <label className="block text-[10px] font-black uppercase mb-4 opacity-60 tracking-wider text-[#234F1E]">Add Tags (Press Enter)</label>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.length > 0 ? (
                tags.map((t, index) => (
                  <span 
                    key={t} 
                    className={`${
                      index % 2 === 0 ? "bg-[#A0AF8E]" : "bg-[#929292]"
                    } text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm`}
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs italic opacity-30 text-[#234F1E]">No tags added yet...</span>
              )}
            </div>
            <input 
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full bg-white px-6 py-4 rounded-2xl border border-[#234F1E]/5 focus:outline-none focus:border-[#234F1E]/20 transition-all font-medium placeholder:opacity-30 text-[#234F1E]"
              placeholder="habits, productivity, mindful tech..."
            />
          </div>
        </section>

        <div className="pt-8 flex justify-center">
          <button 
            onClick={() => setIsPreview(true)}
            disabled={!formData.title || !formData.content || tags.length === 0}
            className="group relative flex items-center gap-4 bg-[#234F1E] text-[#F2F0E8] px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all disabled:opacity-20 disabled:hover:scale-100 disabled:grayscale overflow-hidden"
          >
            <span className="relative z-10">Preview your draft</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

// THE MAIN EXPORT WRAPPED IN SUSPENSE
export default function WritePage() {
  return (
    <main className="min-h-screen bg-[#F2F0E8] py-20 px-6">
      <Suspense fallback={<div className="max-w-4xl mx-auto text-center py-24 text-[#234F1E] opacity-50 italic">Preparing your workspace...</div>}>
        <WriteFormContent />
      </Suspense>
    </main>
  );
}