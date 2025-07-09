import { authors } from "@/data/sampleData";
import { getAuthorNationality } from "@/utils/getAuthorNationality";

export async function GET() {
  const res = await fetch(
    "https://www.googleapis.com/books/v1/volumes?q=bestseller+novel&maxResults=15"
  );

  const data = await res.json();

  const books = await Promise.all(
    data.items?.map(async (item) => {
      const info = item.volumeInfo;
      const author = info.authors?.[0] || "Unknown";
      const nationality = await getAuthorNationality(author);
      return {
        id: item.id,
        title: info.title || "Unknown",
        author,
        description: info.description || "No description",
        cover: info.imageLinks?.thumbnail || null,
        nationality: nationality || "Unknown",
        price: Math.floor(Math.random() * 20) + 10,
      };
    })
  );

  return Response.json({ books });
}
