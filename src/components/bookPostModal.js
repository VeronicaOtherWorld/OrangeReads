"use client";

import { useState, useEffect } from "react";
import { Dialog } from "headlessui/react";

const BookPostModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [title, setTtile] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!title || !description) return;
    onSubmit({ title, description });
    onClose();
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-50 aria-hidden:true"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="rounded-lg max-w-md w-full p-6 shadow-xl">
          <Dialog.Title classNamet="text-lg font-bold mb-4">
            {initialData ? "Edit" : "New"}
          </Dialog.Title>
        </Dialog.Panel>

        <input
          type="text"
          placeholder="post title"
          className="w-full border p-2 mb-4 rounded"
          value={titel}
          onChange={(e) => setTtile(e.target.value)}
        />

        <textarea
          placeholder="description"
          className="w-full border p-2 mb-4 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

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
      </div>
    </Dialog>
  );
};
export default BookPostModal;
