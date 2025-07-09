export async function getBooksFromGoogle(
  startIndex = 0,
  maxResults = 40,
  keyword = "Irish literature"
) {
  const allBooks = [];
  const maxResultsPerRequest = 40;
  const totalNeeded = 100;
  for (
    let startIndex = 0;
    startIndex < totalNeeded;
    startIndex += maxResultsPerRequest
  ) {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        keyword
      )}&startIndex=${startIndex}&maxResults=${maxResults}`
    );
    if (!res.ok) {
      console.error(
        "error when fetch books",
        `in ${startIndex}: ${res.status}}`
      );
      break;
    }

    const data = await res.json();
    if (!data.items || data.items.length === 0) break;
    allBooks.push(...data.items);

    if (data.items.length < maxResultsPerRequest) {
      break;
    }
  }
  return allBooks;
}
