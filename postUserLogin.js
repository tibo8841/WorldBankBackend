import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export async function registerNewUser(server) {
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
        return server.json({ response: "New account created!" }, 200);
      } catch (err) {
        return server.json(
          {
            err: "An account already exists for this username",
          },
          400
        );
      }
    } else {
      return server.json(
        { error: "Passwords do not match, please try again" },
        400
      );
    }
  } else {
    server.json({ error: "Please provide all data" }, 400);
  }
}
