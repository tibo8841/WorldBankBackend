import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export async function registerNewUser(server) {
  const { username, password, passwordConfirmation } = await server.body;

  if (username && password && passwordConfirmation) {
    try {
      await clientUser.queryArray(
        `SELECT * FROM users WHERE username = ${username}`
      );

      const encryptedPassword = await bcrypt.hash(password);
      const encryptedPasswordConfirmation = await bcrypt.hash(
        passwordConfirmation
      );

      const comparison = await bcrypt.compare(
        encryptedPassword,
        encryptedPasswordConfirmation
      );

      if (comparison === true) {
        await clientUser.queryArray(
          `INSERT INTO users (username, password, created_at) VALUES (${username}, ${encryptedPassword}, NOW());`
        );
        return server.json({ response: "New account created!" }, 200);
      } else {
        return server.json(
          { error: "Passwords do not match, please try again" },
          400
        );
      }
    } catch (err) {
      return server.json(
        {
          err: "An account already exists for this username",
        },
        400
      );
    }
  } else {
    server.json({ error: "Please provide all data" }, 400);
  }
}
