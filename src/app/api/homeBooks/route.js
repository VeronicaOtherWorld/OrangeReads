import { authors } from "@/data/sampleData";
import clientPromise from "@/lib/mongo";
import { getAuthorNationality } from "@/utils/getAuthorNationality";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const books = await db
      .collection("books")
      .find({ nationality: { $exists: true, $ne: "" } })
      .limit(15)
      .toArray();
    return Response.json({ books });
  } catch (err) {
    console.error(err);
  }
}
