import { Application } from "https://deno.land/x/abc/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.11.3/mod.ts";
import { abcCors } from "https://deno.land/x/cors/mod.ts";

const client = new Client(
  "postgres://czreijar:TJ2StTuQIl2CoRoinQTwPxk8pBGfdf6t@kandula.db.elephantsql.com/czreijar"
);

await client.connect();

const countryCodes = (
  await client.queryObject("SELECT CountryCode FROM countries")
).rows;

console.log(countryCodes);

const app = new Application();

// testing github stuff
