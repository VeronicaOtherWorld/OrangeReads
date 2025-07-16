import clientPromise from "@/lib/mongo";

export async function generateMetadata({ params }) {
  const client = await clientPromise;
  const db = client.db();
  const post = await db.collection("swapPost").findOne({ id: params.id });

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.postContent?.slice(0, 100) || "",
  };
}
