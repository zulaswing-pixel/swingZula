// "use client";

// import React from "react";
// import Link from "next/link";

// // Updated blog data for Acrylic Swing Zula
// const blogPosts = [
//   {
//     id: "1",
//     title: "Why Acrylic Swing Zula is the Perfect Addition to Your Balcony",
//     excerpt: "Transform your outdoor space into a relaxing haven with our crystal-clear, ultra-strong acrylic swing.",
//     date: "December 10, 2025",
//     category: "Lifestyle",
//     image: "/img19.png",
//     readTime: "6 min read",
//     author: "Neha Desai",
//     content: `
//       <p>Nothing beats the gentle sway of a swing on a peaceful evening. Our Acrylic Swing Zula brings that timeless joy...</p>
//     `,
//   },
//   {
//     id: "2",
//     title: "How to Choose the Right Swing Zula: Clear vs Tinted vs Printed",
//     excerpt: "Confused between clear, tinted, or custom printed acrylic? Here's your complete guide to picking the perfect one.",
//     date: "November 28, 2025",
//     category: "Buying Guide",
//     image: "/img20.png",
//     readTime: "8 min read",
//     author: "Raj Mehta",
//     content: `<p>With so many beautiful options, choosing the right Swing Zula can feel overwhelming...</p>`,
//   },
//   {
//     id: "3",
//     title: "5 Creative Ways to Style Your Acrylic Swing Zula at Home",
//     excerpt: "From cozy reading nook to Instagram-worthy corner — ideas to make your Swing Zula the star of your home.",
//     date: "November 15, 2025",
//     category: "Home Decor",
//     image: "/img21.png",
//     readTime: "5 min read",
//     author: "Priya Sharma",
//     content: `<p>Your Swing Zula isn't just a swing — it's a statement piece...</p>`,
//   },
// ];

// export default function BlogPage() {
//   return (
// <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-32 px-6 sm:px-12">


// <h1 className="text-4xl sm:text-5xl font-bold leading-normal mb-10 text-center bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
//   Swing Zula Stories
// </h1>
 
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {blogPosts.map((post) => (
//           <article
//             key={post.id}
//             className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200"
//           >
//             <div className="relative overflow-hidden">
//               <img
//                 src={post.image}
//                 alt={post.title}
//                 className="w-full h-60 object-cover hover:scale-110 transition-transform duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
//             </div>

//             <div className="p-6">
//               <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
//                 <span className="font-medium">{post.category}</span>
//                 <span>{post.readTime}</span>
//               </div>

//               <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
//                 {post.title}
//               </h2>
//               <p className="text-slate-700 mb-5 line-clamp-3">
//                 {post.excerpt}
//               </p>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-slate-500">by {post.author}</span>

//                 {/* Read More Link */}
//                 <Link
//                   href={`/blog/${post.id}`}
//                   className="text-indigo-700 font-semibold hover:text-indigo-900 flex items-center gap-1 transition-colors"
//                 >
//                   Read More
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </Link>
//               </div>
//             </div>
//           </article>
//         ))}
//       </div>
//     </main>
//   );
// }



// app/blog/page.js
import Link from "next/link";
import { getBlogs } from "@/lib/shopify";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Khakhra Parampara | Annapurna Khakhra",
  description: "Stories, recipes & health insights from Annapurna Khakhra.",
};

export default async function BlogPage() {
  const blogs = await getBlogs();

  // Flatten all articles from all blogs
  const articles = blogs.flatMap(blog =>
    blog.articles.map(article => ({
      ...article,
      blogHandle: blog.handle,
    }))
  );

  if (!articles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">No blogs found.</h1>
      </div>
    );
  }

  return (<>
  <Breadcrumbs />
    <main className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-sky-100 py-12 px-6 sm:px-12">
      <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-10 text-center">
        Heritage of Swing Zula
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
          >
            {/* Article Image */}
            <img
              src={post.image?.url || "/blog-placeholder.webp"}
              alt={post.title}
              className="w-full h-75 object-cover hover:scale-105 transition-transform duration-500"
            />

            <div className="p-6">

              {/* Date */}
              {post.publishedAt && (
                <p className="text-sm text-blue-600 mb-3">
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}

              <h2 className="text-xl font-bold text-blue-900 mb-3">{post.title}</h2>
              {post.excerpt && (
                <p
                  className="text-amber-700 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              )}

              <Link
                href={`/blog/${post.blogHandle}/${post.handle}`}
                className="text-blue-900 font-medium hover:text-blue-600"
              >
                Read More →
              </Link>
            </div>
          </article>

        ))}
      </div>
    </main></>
  );
}
