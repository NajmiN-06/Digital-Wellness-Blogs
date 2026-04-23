import prisma from "@/app/lib/prisma";
import { notFound } from "next/navigation";
import EditPostButton from "@/app/components/EditPost";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { id: slug },
    include: { tags: true }
  });

  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-[#F2F0E8] text-[#234F1E]">
      
      {/* Increased max-width and vertical padding for an editorial feel */}
      <article className="max-w-4xl mx-auto py-24 px-6 md:px-12 flex flex-col">
        
        {/* Header Section */}
        <header className="mb-16">
          <div className="flex gap-2 mb-8 justify-center flex-wrap">
            {post.tags.map((tag, index) => (
              <span 
                key={tag.id} 
                className={`${
                  index % 2 === 0 ? "bg-[#A0AF8E]" : "bg-[#929292]"
                } text-white px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-serif italic text-center leading-tight text-[#234F1E] tracking-tight">
            {post.title}
          </h1>

          <div className="mt-10 flex items-center justify-center gap-4 border-y border-[#234F1E]/5 py-6">
            <div className="bg-[#234F1E] text-[#F2F0E8] w-10 h-10 rounded-full flex items-center justify-center font-bold">
              {post.authorName.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">{post.authorName}</p>
              <p className="text-xs opacity-50 uppercase tracking-tighter">
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <EditPostButton postId={post.id} />
        </header>

        {/* Content Section - Crucial Fixes Here */}
        <div className="relative">
          {/* Subtle vertical accent line from your vision */}
          <div className="absolute -left-4 md:-left-8 top-0 bottom-0 w-px bg-[#234F1E]/10 hidden md:block" />
          
          {/* 'max-w-none' prevents the prose plugin from capping the width/height */}
          <div className="prose prose-lg md:prose-xl max-w-none text-[#234F1E]/90 leading-relaxed font-light">
            {/* 'whitespace-pre-line' preserves paragraphs without needing manual <br> tags */}
            <p className="whitespace-pre-line text-lg md:text-xl">
              {post.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-[#234F1E]/10 text-center">
          <p className="text-sm opacity-40 italic font-serif">
            Thanks for reading Mindful Tech.
          </p>
        </footer >
      </article>
    </main>
  );
}