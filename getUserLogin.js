import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export async function getUserLogin(server) {
  const { username, password } = await server.body;
  const query = await clientUser.queryObject(
    `SELECT * FROM users WHERE username = ${username};`
  );
  if (query) {
    const passwordConfirm = await clientUser.queryObject(
      `SELECT password FROM users WHERE username = ${username};`
    );

    const encryptedPassword = await bcrypt.hash(password);
    const encryptedPasswordConfirm = await bcrypt.hash(passwordConfirm);

    const comparison = await bcrypt.compare(
      encryptedPassword,
      encryptedPasswordConfirm
    );

    if (comparison === true) {
      return server.json({ response: "Success, you are now logged in" }, 200);
    }
  } else {
    return server.json({
      error: "An account with that username does not exist, please sign up",
    });
  }
}
