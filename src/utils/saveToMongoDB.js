import clientPromise from "@/lib/mongo";

export async function saveToMongoDB(books) {
  const client = await clientPromise;
  //
  const db = client.db("orangereads");
  const collection = db.collection("books");

  for (const book of books) {
    try {
      const existing = await collection.findOne({ id: book.id });
      if (existing) {
        continue;
      }
      await collection.insertOne(book);
    } catch (err) {
      console.error(`error saving book ${book.title}:`, err);
    }
  }
}
