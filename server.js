import { Application } from "https://deno.land/x/abc/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts";
import { abcCors } from "https://deno.land/x/cors/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const DENO_ENV = Deno.env.get("DENO_ENV") ?? "development";
config({ path: `./.env.${DENO_ENV}`, export: true });

const clientUser = new Client(Deno.env.get("PG_URL"));
await clientUser.connect();

const clientCountry = new Client(
  "postgres://czreijar:TJ2StTuQIl2CoRoinQTwPxk8pBGfdf6t@kandula.db.elephantsql.com/czreijar"
);
await clientCountry.connect();

const app = new Application();
const PORT = Number(Deno.env.get("PORT"));

const corsSettings = {
  allowedHeaders: [
    "Authorization",
    "Content-Type",
    "Accept",
    "Origin",
    "User-Agent",
  ],
  credentials: true,
};

app
  .use(abcCors(corsSettings))
  .get("/", async (server) => {
    await displayTest(server);
  })
  .get("/login", async (server) => {
    await getUserLogin(server);
    // await createSession(server);
  })
  .post("/register", async (server) => {
    await registerNewUser(server);
  })
  .get("/search", async (server) => {
    await getSearchResults(server);
  })
  .post("/search", async (server) => {
    await postSearchHistory(server);
  })
  .get("/history", async (server) => {
    await getUserHistory(server);
  })
  .start({ port: PORT });

async function displayTest(server) {
  const testInfo = await clientCountry.queryObject(
    `SELECT * FROM indicators WHERE CountryCode = $1 AND IndicatorCode = $2 AND Year >= $3 AND Year <= $4`,
    "FRA",
    "SP.POP.DPND.YG",
    1990,
    1999
  );
  await server.json(testInfo);
  // return server.json({ response: "test working!" }, 200);
}

import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export async function getUserLogin(server) {
  const { username, password } = await server.body;

  const query = await clientUser.queryObject(
    `SELECT * FROM users WHERE username = $1;`,
    username
  );

  if (query.rows.length) {
    const passwordConfirm = await clientUser.queryObject(
      `SELECT password FROM users WHERE username = $1;`,
      username
    );

    const comparison = await bcrypt.compare(
      password,
      `${passwordConfirm.rows[0].password}`
    );

    if (comparison === true) {
      await server.json({ loggedIn: true });
      return server.json({ response: "Success, you are now logged in" }, 200);
    } else {
      await server.json({ loggedIn: false });
      return server.json(
        { error: "Incorrect password, please try again!" },
        400
      );
    }
  } else {
    await server.json({ loggedIn: false });
    return server.json(
      {
        err: "An account with that username does not exist, please sign up",
      },
      400
    );
  }
}

async function registerNewUser(server) {
  const { username, password, passwordConfirmation } = await server.body;

  if (username && password && passwordConfirmation) {
    if (password === passwordConfirmation) {
      const encryptedPassword = await bcrypt.hash(password);

      try {
        await clientUser.queryObject(
          `INSERT INTO users (username, password, created_at) VALUES ($1, $2, NOW());`,
          username,
          encryptedPassword
        );
        await server.json({ accountCreated: true });
        return server.json({ response: "New account created!" }, 200);
      } catch (err) {
        await server.json({ accountCreated: false });
        return server.json(
          {
            err: "An account already exists for this username",
          },
          400
        );
      }
    } else {
      await server.json({ accountCreated: false });
      return server.json(
        { error: "Passwords do not match, please try again" },
        400
      );
    }
  } else {
    await server.json({ accountCreated: false });
    server.json({ error: "Please provide all data" }, 400);
  }
}

async function getSearchResults(server) {
  const { country, indicator, yearStart, yearEnd } = await server.queryParams;

  const searchResponse = await clientCountry.queryObject(
    `SELECT CountryCode, IndicatorName, Value, Year FROM indicators WHERE CountryCode = $1 AND IndicatorName = $2 AND Year >= $3 AND Year <= $4`,
    country,
    indicator,
    yearStart,
    yearEnd
  );

  await server.json(searchResponse);
}

async function postSearchHistory(server) {
  const { userID, country, indicator, yearRange } = await server.body;

  if (country && indicator && yearRange) {
    await clientUser.queryObject(
      `INSERT INTO search_history (user_id, countries, year_range, indicators,created_at) VALUES ($1, $2, $3, $4,NOW());`,
      userID,
      country,
      yearRange,
      indicator
    );
    return server.json({ response: "Added to database" }, 200);
  } else if (countries && yearRange) {
    await clientUser.queryObject(
      `INSERT INTO search_history (user_id, countries, year_range, created_at) VALUES ($1, $2, $3, NOW());`,
      userID,
      country,
      yearRange
    );
    return server.json({ response: "Added to database" }, 200);
  } else {
    return server.json({ response: "Missing necessary data" }, 404);
  }
}

async function getUserHistory(server) {
  const { userID } = await server.body;
  const historyResult = await clientUser.queryObject(
    `SELECT * FROM search_history WHERE user_id = $1`,
    userID
  );
  if (historyResult) {
    await server.json(historyResult);
  } else {
    return server.json({ error: "ERROR" });
  }
}
