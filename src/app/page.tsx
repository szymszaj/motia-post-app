import { prisma } from "@/lib/prisma";
import { PostForm, PostCard } from "./components";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Aplikacja Postów
        </h1>

        <PostForm />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Posty ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              Brak postów. Utwórz pierwszy post!
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
