import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/content/blog/posts";

// Pre-generate all blog post routes at build time
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

// Dynamically generate metadata for each post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | PromptLens`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://promptlens.ai/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | PromptLens`,
      description: post.description,
      url: `https://promptlens.ai/blog/${post.slug}`,
      siteName: "PromptLens",
      type: "article",
      publishedTime: post.date,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  // Dynamically import the content component for this slug
  let ContentComponent: React.ComponentType;
  try {
    const mod = await import(`@/app/(main)/blog/content/${slug}`);
    ContentComponent = mod.default;
  } catch {
    notFound();
  }

  return <ContentComponent />;
}
