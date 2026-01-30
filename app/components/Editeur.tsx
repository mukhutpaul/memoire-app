"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";

import { createAnnonce } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

/* ============================
   QUILL (NO SSR)
============================ */
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

/* ============================
   HANDLER IMAGE
============================ */
const imageHandler = function (this: any) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.click();

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };
};

interface Props {
  userId: string;
}

export default function Editeur({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const router = useRouter();

  const quillRef = useRef<any>(null);

  /* ============================
     INSERER EMOJI
  =========================== */
  const insertEmoji = (emoji: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true);
    quill.insertText(range.index, emoji);
    quill.setSelection(range.index + emoji.length);
    setShowEmoji(false);
  };

  /* ============================
     CONFIG QUILL
  =========================== */
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  /* ============================
     SUBMIT
  =========================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAnnonce(title, content, userId);
      setTitle("");
      setContent("");
      toast.success("Connexion réussie ✅")
      confetti()
      router.push("/annonces");
    } catch{
        toast.error("Erreur d'enregistrement ❌")
    }
     finally {
      setLoading(false);
     }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="card bg-base-200 p-6 space-y-4">
        {/* TITRE */}
        <input
          className="input input-bordered w-full"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* BOUTON EMOJI */}
        <div className="flex justify-end relative">
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className="btn btn-sm"
          >
            😀
          </button>

          {/* PICKER */}
          {showEmoji && (
            <div className="absolute z-50 right-0 top-10">
              <EmojiPicker
                onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
                theme="light"
              />
            </div>
          )}
        </div>

        {/* QUILL EDITOR */}
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Contenu de l'annonce..."
        />

        {/* BOUTON PUBLIER */}
        <button className="btn btn-accent" disabled={loading}>
          {loading ? <span className="loading loading-ball loading-md"></span> : "Publier"}
        </button>
      </form>
    </div>
  );
}


