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
      return server.json({ response: "Success, you are now logged in" }, 200);
    } else {
      return server.json(
        { error: "Incorrect password, please try again!" },
        400
      );
    }
  } else {
    return server.json(
      {
        err: "An account with that username does not exist, please sign up",
      },
      400
    );
  }
}
