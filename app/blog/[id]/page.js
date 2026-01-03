"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiCalendar, FiArrowLeft, FiUser } from "react-icons/fi";

// Updated blog data for Acrylic Swing Zula
const blogPosts = [
  {
    id: "1",
    title: "Why Acrylic Swing Zula is the Perfect Addition to Your Balcony",
    excerpt: "Transform your outdoor space into a relaxing haven with our crystal-clear, ultra-strong acrylic swing.",
    date: "December 10, 2025",
    category: "Lifestyle",
    image: "/img19.png",
    readTime: "6 min read",
    author: "Neha Desai",
    content: `
      <p>Nothing beats the gentle sway of a swing on a peaceful evening. Our Acrylic Swing Zula brings that timeless joy right to your balcony, terrace, or living room — combining modern elegance with incredible strength.</p>
      
      <p>Made from premium virgin cast acrylic and reinforced with marine-grade SS304 hardware, it safely holds up to 250kg while looking almost invisible in your space.</p>
      
      <h2>The Magic of Transparency</h2>
      <p>The crystal-clear acrylic gives an illusion of floating in air, making even small balconies feel spacious and luxurious. Whether you're sipping morning tea or stargazing at night, the Swing Zula becomes your personal relaxation spot.</p>
      
      <h2>Built to Last, Designed to Impress</h2>
      <p>UV-stabilized to prevent yellowing, shatter-resistant for safety, and hand-polished edges — every detail is crafted for daily family use with complete peace of mind.</p>
      
      <p>Join thousands of happy customers who’ve turned ordinary corners into extraordinary experiences.</p>
    `,
  },
  {
    id: "2",
    title: "How to Choose the Right Swing Zula: Clear vs Tinted vs Printed",
    excerpt: "Confused between clear, tinted, or custom printed acrylic? Here's your complete guide to picking the perfect one.",
    date: "November 28, 2025",
    category: "Buying Guide",
    image: "/img20.png",
    readTime: "8 min read",
    author: "Raj Mehta",
    content: `<p>With so many beautiful options available, choosing the perfect Acrylic Swing Zula can feel overwhelming. Let’s break it down to help you decide what suits your space and style best.</p>
    
      <h2>Clear Acrylic Swing Zula</h2>
      <p>Perfect for those who love openness and modern minimalism. It blends seamlessly with any decor and makes small spaces feel larger.</p>
      
      <h2>Tinted (Smoke/Bronze) Swing Zula</h2>
      <p>Offers subtle privacy while still letting in light. Ideal for balconies facing neighbors or busy streets — elegant and sophisticated.</p>
      
      <h2>Printed Pattern Swing Zula</h2>
      <p>Turn your swing into art! Choose from floral, geometric, abstract, or even custom family photos printed directly on the acrylic.</p>
      
      <p>No matter which you choose, all variants come with the same strength, safety, and warranty.</p>`,
  },
  {
    id: "3",
    title: "5 Creative Ways to Style Your Acrylic Swing Zula at Home",
    excerpt: "From cozy reading nook to Instagram-worthy corner — ideas to make your Swing Zula the star of your home.",
    date: "November 15, 2025",
    category: "Home Decor",
    image: "/img21.png",
    readTime: "5 min read",
    author: "Priya Sharma",
    content: `<p>Your Acrylic Swing Zula isn't just a swing — it's a statement piece that can transform any corner of your home. Here are 5 creative styling ideas:</p>
    
      <ol>
        <li><strong>Cozy Reading Nook:</strong> Add soft cushions, fairy lights, and a side table for books.</li>
        <li><strong>Minimal Zen Corner:</strong> Pair with indoor plants and neutral tones for calm vibes.</li>
        <li><strong>Kids Play Area:</strong> Safe and fun — perfect for little ones to swing gently indoors.</li>
        <li><strong>Balcony Retreat:</strong> Hang near potted plants with a coffee mug holder attached.</li>
        <li><strong>Photo Spot:</strong> The clear acrylic makes every picture look magical!</li>
      </ol>
      
      <p>The possibilities are endless. Make it yours!</p>`,
  },
];

export default function BlogDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const blog = blogPosts.find((b) => b.id === id);

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <p className="text-slate-700 mb-6 text-lg">Blog not found.</p>
        <button
          onClick={() => router.push("/blog")}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-800 transition-all duration-300 shadow-lg cursor-pointer"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-6 sm:px-12 py-12">
      <article className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-indigo-700 mb-8 font-semibold hover:text-indigo-900 transition-colors cursor-pointer"
        >
          <FiArrowLeft className="mr-2 text-lg" /> Back to Blogs
        </button>

        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
          <motion.img
            src={blog.image}
            alt={blog.title}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mt-10 mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
          {blog.title}
        </h1>

        <div className="flex flex-wrap gap-6 text-slate-600 text-sm mb-10">
          <span className="flex items-center gap-2">
            <FiCalendar className="text-indigo-600" /> {blog.date}
          </span>
          <span className="flex items-center gap-2">
            <FiUser className="text-indigo-600" /> {blog.author}
          </span>
          {blog.readTime && (
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {blog.readTime}
            </span>
          )}
          {blog.category && (
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
              {blog.category}
            </span>
          )}
        </div>

        <div
          className="prose prose-lg max-w-none text-slate-700 
                     prose-headings:text-slate-900 
                     prose-headings:font-bold 
                     prose-a:text-indigo-600 prose-a:hover:text-indigo-800 
                     prose-strong:text-slate-900 
                     prose-blockquote:border-l-indigo-600 prose-blockquote:bg-indigo-50
                     prose-ol:list-decimal prose-ol:pl-6
                     prose-li:my-2"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
}