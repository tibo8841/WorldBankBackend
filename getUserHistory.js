async function getUserHistory(server) {
  const { userID } = await server.body;
  const historyResult = await clientUser.queryObject(
    `SELECT * FROM search_history WHERE user_id = ${userID}`
  );
  if (historyResult) {
    await server.json(historyResult);
    return server.json({ response: "Here is search history" }, 200);
  } else {
    return server.json({ error: "ERROR" });
  }
}
