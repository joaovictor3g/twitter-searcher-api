import "dotenv/config";

import { twitClient } from "./lib/twit";
import fs from "node:fs";
import jsonexport from "jsonexport";

const q = process.argv[2];

if (!q) throw new Error("You need provide a search string!");

twitClient.get("/search/tweets", { q, count: 100, lang: "pt" }, (err, data) => {
  if (err) throw err;

  const { statuses } = data as { statuses: any[] };
  const parsedStatus = statuses.map((status) => ({
    id: status.id,
    label: status.user.name,
    text: status.text.replace(/[\r\n]+/gm, " "),
    created_at: status.created_at,
    location: status.user.location,
    verified: status.user.verified,
    name: status.user.name,
    geo: status.geo,
    description: status.user.description,
    source: status.id,
    target: status.retweeted_status?.id,
    retweet_count: status.retweet_count,
  }));

  jsonexport(parsedStatus, (err: Error, csv: string) => {
    if (err) throw err;

    fs.appendFile("./data/tweets.csv", csv, (err) => {
      if (err) throw err;

      console.log(`Output saved`);
    });
  });
});
