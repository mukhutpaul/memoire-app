'use client'

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import EmojiPicker from 'emoji-picker-react'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function Editeur() {
  const [mounted, setMounted] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    // ⚡ Only run on client
    setMounted(true)
  }, [])

  if (!mounted) return null // pas de rendu côté serveur

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'link', 'image',
  ]

  const addEmoji = (emojiObject: { emoji: string }) => {
    if (!quillRef.current) return
    const quill = quillRef.current.getEditor()
    const range = quill.getSelection(true)
    quill.insertText(range.index, emojiObject.emoji, 'user')
    quill.setSelection(range.index + emojiObject.emoji.length)
  }

  const handlePublish = () => {
    if (!quillRef.current) return
    const quill = quillRef.current.getEditor()
    console.log(quill.root.innerHTML)
  }

  return (
    <div className="card bg-base-100 shadow-xl p-4 space-y-4 relative">
      <button className="btn btn-sm" onClick={() => setShowPicker(!showPicker)}>
        😄 Emoji
      </button>

      {showPicker && (
        <div className="absolute z-50">
          <EmojiPicker onEmojiClick={addEmoji} />
        </div>
      )}

      <ReactQuill
        ref={quillRef as any} // TS workaround
        theme="snow"
        defaultValue=""
        modules={modules}
        formats={formats}
        placeholder="Écris ton annonce ici…"
      />

      <button className="btn btn-accent mt-4" onClick={handlePublish}>
        Publier
      </button>
    </div>
  )
}
