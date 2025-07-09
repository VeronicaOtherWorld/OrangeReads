import { getBooksFromGoogle } from "./getBooksFromGoogle";
import { getAuthorNationality } from "./getAuthorNationality";
import { formatBookData } from "./formatBookData";
import { saveToMongoDB } from "./saveToMongoDB";

export async function fetchAndSaveBook() {
  console.log("🔥 fetchAndSaveBook() STARTED");

  const keywords = [
    "Irish literature",
    "European fiction",
    "Japanese novels",
    "French literature",
    "Chinese literature",
    "African novels",
    "South American fiction",
  ];

  const maxResults = 40;
  const maxPagesPerKeyword = 3;
  let totalSaved = 0;

  for (const keyword of keywords) {
    console.log(`fetching for keyword: "${keyword}"`);
    let startIndex = 0;

    while (startIndex < maxResults * maxPagesPerKeyword) {
      const books = await getBooksFromGoogle(startIndex, maxResults, keyword);
      if (!books || books.length === 0) break;

      for (const rawBook of books) {
        const author = rawBook?.volumeInfo?.authors?.[0];
        if (!author) continue;

        const nationality = await getAuthorNationality(author);
        if (!nationality || nationality === "unknown") {
          console.log(
            `skipped: ${rawBook.volumeInfo?.title} - Unknown nationality`
          );
          continue;
        }

        const formatted = formatBookData(rawBook, nationality);
        await saveToMongoDB([formatted]);
        totalSaved++;
      }

      startIndex += maxResults;
    }
  }

  console.log(`✅ Finished fetching and saving. Total saved: ${totalSaved}`);
}
