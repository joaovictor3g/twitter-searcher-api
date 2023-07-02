import "dotenv/config";

import { twitClient } from "./lib/twit";
import fs from "node:fs";
import jsonexport from "jsonexport";
import { file } from "./lib/commander";

fs.readFile(file, "utf8", (err, data) => {
  if (err) throw err;

  const { words } = JSON.parse(data);

  words.forEach((word, index) => {
    twitClient.get(
      "/search/tweets",
      { q: word, count: 100, lang: "pt" },
      (err, data) => {
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

            console.log(`Output ${index} saved`);
          });
        });
      }
    );
  });
});
