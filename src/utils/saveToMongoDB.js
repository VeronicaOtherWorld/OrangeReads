import clientPromise from "@/lib/mongo";

export async function saveToMongoDB(books) {
  console.log("books to be saved:", books);
  const client = await clientPromise;
  //
  const db = client.db("orangereads");
  const collection = db.collection("books");

  for (const book of books) {
    try {
      console.log("trying to save:", book.title);
      const existing = await collection.findOne({ id: book.id });
      if (existing) {
        console.log(`Book ${book.id} already exists, skip.`);
        continue;
      }
      console.log("inserting into db:", book.title);
      await collection.insertOne(book);
      console.log(`saved ${book.title}`);
    } catch (err) {
      console.error(`error saving book ${book.title}:`, err);
    }
  }
}
