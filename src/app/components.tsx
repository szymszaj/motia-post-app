"use client";

import { useActionState, useRef, useEffect } from "react";
import { createPost, deletePost, ActionState } from "./actions";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  Processing: {
    label: "Processing",
    className: "bg-yellow-100 text-yellow-800",
  },
  Completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800",
  },
  Failed: {
    label: "Failed",
    className: "bg-red-100 text-red-800",
  },
};

function PostForm() {
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(createPost, null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Utwórz nowy post
      </h2>

      {state?.success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
          Post utworzony pomyślnie! Workflow przetwarza go w tle.
        </div>
      )}

      {state?.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
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
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              state?.fieldErrors?.title
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
            }`}
            placeholder="Wpisz tytuł posta..."
          />
          {state?.fieldErrors?.title && (
            <p className="mt-1 text-xs text-red-600">
              {state.fieldErrors.title[0]}
            </p>
          )}
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
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              state?.fieldErrors?.content
                ? "border-red-400 bg-red-50"
                : "border-gray-300"
            }`}
            placeholder="Wpisz treść posta..."
          />
          {state?.fieldErrors?.content && (
            <p className="mt-1 text-xs text-red-600">
              {state.fieldErrors.content[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Tworzenie..." : "Utwórz Post"}
        </button>
      </form>
    </div>
  );
}

function PostCard({
  post,
}: {
  post: {
    id: number;
    title: string;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}) {
  const badge = STATUS_BADGE[post.status] ?? {
    label: post.status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-900 mr-4">
          {post.title}
        </h3>
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>
      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>
          Utworzono: {new Date(post.createdAt).toLocaleString("pl-PL")}
        </span>
        <form
          action={async () => {
            await deletePost(post.id);
          }}
        >
          <button
            type="submit"
            className="text-red-500 hover:text-red-700 transition-colors font-medium text-xs"
            onClick={(e) => {
              if (!confirm("Czy na pewno chcesz usunąć ten post?")) {
                e.preventDefault();
              }
            }}
          >
            Usuń
          </button>
        </form>
      </div>
    </div>
  );
}

export { PostForm, PostCard };
