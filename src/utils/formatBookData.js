import { authors } from "@/data/sampleData";

export function formatBookData(raw, nationality = "") {
  const info = raw.volumeInfo || {};

  return {
    id: raw.id,
    title: info.title,
    author: info.authors[0],
    nationality,
    cover: info.imageLinks?.thumbnail || "",
    description: info.description || "",
    price: parseFloat((Math.random() * 20 + 5).toFixed(2)),
    tags: info.categories || [],
    createdAt: new Date(),
    genre: (info.categories && info.categories[0]) || "general",
  };
}
