import { Application } from "https://deno.land/x/abc/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts";
import { abcCors } from "https://deno.land/x/cors/mod.ts";

// url below is database being hosted on elephantSQL

const clientUser = new Client(
  `postgres://xtvjajky:1I2LmKlHwfx8RgKOYf6N-81Gg4eRUH_J@tyke.db.elephantsql.com/xtvjajky`
);
await clientUser.connect();

const clientCountry = new Client(
  "postgres://czreijar:TJ2StTuQIl2CoRoinQTwPxk8pBGfdf6t@kandula.db.elephantsql.com/czreijar"
);
await clientCountry.connect();

// BELOW IS EXAMPLE OF INSERT QUERY

// await clientUser.queryArray(
//   `INSERT INTO users (username, password, created_at) VALUES ('test', 'password', NOW());`
// );

// EXAMPLE BELOW OF HOW TO QUERY DATABASE TO SHOW WHATS IN USER TABLE AND CONSOLE LOG IT

// let boop = await clientUser.queryObject(`SELECT * FROM users`);

// console.log(boop.rows);

const app = new Application();

app
  .use(
    abcCors({
      allowedHeaders: [
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "User-Agent",
      ],
      credentials: true,
    })
  )
  .get("/login", async (server) => {
    await getUserLogin(server);
    await createSession(server);
  })
  .post("/register", async (server) => {
    await registerNewUser(server);
  })
  .get("/search", async (server) => {
    await getSearchResults(server);
    await postSearchHistory(server);
  })
  .get("/history", async (server) => {
    await getUserHistory(server);
  });
