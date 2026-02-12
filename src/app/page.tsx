import { prisma } from "@/lib/prisma";
import { createPost } from "./actions";

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Aplikacja Postów
        </h1>

        <div className="text-gray-900 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Utwórz nowy post</h2>
          <form action={async (formData) => { await createPost(formData); }} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tytuł
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wpisz tytuł posta..."
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Treść
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wpisz treść posta..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Utwórz Post
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Posty ({posts.length})
          </h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              Brak postów. Utwórz pierwszy post!
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{post.content}</p>
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString("pl-PL")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
