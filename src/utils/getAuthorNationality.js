export async function getAuthorNationality(authorName) {
  // use wikidata api search author name, and get qid
  const getQId = async (authorName) => {
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
      authorName
    )}&language=en&format=json&origin=*`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("🟡 QID Search Result for", authorName, data);
      if (data.search && data.search.length > 0) {
        return data.search[0].id;
      }
    } catch (err) {
      console.log("get qid error", err);
    }
    return null;
  };

  // use qid to find the country
  const getNationality = async (qid) => {
    // in case wikidata limits when we query data too fast
    await new Promise((resolve) => setTimeout(resolve, 200));
    const query = `SELECT ?countryLabel WHERE {
      wd:${qid} wdt:P27 ?country.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT 1`;

    const url =
      "https://query.wikidata.org/sparql?query=" +
      encodeURIComponent(query) +
      "&format=json";

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "OrangeReadsBot/1.0 (https://orangereads.example.com)",
        },
      });
      const data = await res.json();
      console.log("🟢 Nationality Query Result for QID", qid, data);
      const len = data.results.bindings.length;
      if (len > 0) {
        return data.results.bindings[0].countryLabel.value;
      }
    } catch (err) {
      console.log("get nat err", err);
    }
    return "unknown";
  };

  const qid = await getQId(authorName);

  if (!qid) {
    console.log(`No QID found for author: "${authorName}"`);
    return "unknown";
  }

  return await getNationality(qid);
}
