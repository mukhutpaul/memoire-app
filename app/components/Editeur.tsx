"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import EmojiPicker from "emoji-picker-react";
import { createAnnonce } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";

// Quill dynamiquement, pas de SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Props {
  userId: string;
}

export default function Editeur({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const quillRef = useRef<any>(null);
  const router = useRouter();

  // Insérer emoji
  const insertEmoji = (emoji: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true) || { index: quill.getLength() };
    quill.insertText(range.index, emoji);
    quill.setSelection(range.index + emoji.length);
    setShowEmoji(false);
  };

  // Ajouter image
  const imageHandler = () => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const range = quill.getSelection() || { index: quill.getLength() };
        quill.insertEmbed(range.index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: { image: imageHandler },
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const content = quill.root.innerHTML;
    if (!title.trim() || content === "<p><br></p>") {
      toast.error("Veuillez saisir un titre et un contenu !");
      return;
    }

    setLoading(true);
    try {
      await createAnnonce(title, content, userId);
      setTitle("");
      quill.setContents([]); // reset contenu
      toast.success("Annonce publiée ✅");
      confetti();
      router.push("/annonces");
    } catch {
      toast.error("Erreur d'enregistrement ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="card bg-base-200 p-6 space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex justify-end relative">
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className="btn btn-sm"
          >
            😀
          </button>
          {showEmoji && (
            <div className="absolute z-50 right-0 top-10">
              <EmojiPicker
                onEmojiClick={(e) => insertEmoji(e.emoji)}
                theme="light"
              />
            </div>
          )}
        </div>

        <ReactQuill
          ref={quillRef}
          defaultValue="" // NE PAS UTILISER `value` !!
          modules={modules}
          placeholder="Contenu de l'annonce..."
        />

        <button className="btn btn-accent" disabled={loading}>
          {loading ? (
            <span className="loading loading-ball loading-md"></span>
          ) : (
            "Publier"
          )}
        </button>
      </form>
    </div>
  );
}
