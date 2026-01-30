// "use client";

import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";
import { createAnnonce } from "../actions";


const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "emoji"],
    ["clean"],
  ],
  "emoji-toolbar": true,
  "emoji-shortname": true,
};

interface Props {
  userId: string;
}

export default function AnnonceForm({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createAnnonce(title, content, userId);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 p-6 space-y-4">
      <input
        className="input input-bordered w-full"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="Contenu de l'annonce..."
      />

      <button className="btn btn-accent" disabled={loading}>
        {loading ? <span className="loading loading-ring loading-sm"></span> : "Publier"}
      </button>
    </form>
  );
}
