"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { toBase64 } from "@/utils/toBase64";

const BookPostModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [img, setImg] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setPostContent(initialData.postContent || "");
    } else {
      setTitle("");
      setPostContent("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!title || !postContent) {
      alert("Please fill in both title and post Content.");
      return;
    }
    onSubmit({ title, postContent, img });
    onClose();
  };

  const handleImgChange = async (e) => {
    const file = e.target.files?.[0];
    const img = await toBase64(file);
    if (file) {
      setImg(img);
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-50 aria-hidden:true"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="rounded-lg max-w-md w-full p-6 shadow-xl ">
          <DialogTitle className="text-lg font-bold mb-4">
            {initialData ? "Edit" : "New"}
          </DialogTitle>

          {/* title */}

          <input
            type="text"
            placeholder="post title"
            className="w-full border p-2 mb-4 rounded"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* content */}

          <textarea
            placeholder="postContent"
            className="w-full border p-2 mb-4 rounded h-64"
            value={postContent}
            required
            onChange={(e) => setPostContent(e.target.value)}
          ></textarea>

          {/* upload img*/}
          <div className="mb-4">
            <label className="inline-block px-4 py-2 bg-amber-400 text-white rounded cursor-pointer hover:bg-amber-500">
              Upload Image
              <input
                type="file"
                onChange={handleImgChange}
                className="hidden"
              />
            </label>

            {img && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                <img
                  src={img}
                  alt="preview"
                  className="w-full max-h-16 max-w-16 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-amber-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-800"
            >
              {initialData ? "update" : "post"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
export default BookPostModal;
