export default async function postSearchHistory(server) {
  const { userID, countries, indicators, yearRange } = await server.body;

  if (countries && indicators && yearRange){
    await clientUser.queryObject(
    `INSERT INTO search_history (user_id, countries, year_range, indicators,created_at) VALUES (${userID}, ${countries}, ${yearRange}, ${indicators},NOW());`,
  );
  return server.json({response: "Added to database"},200)
  } else if(countries && yearRange){
        await clientUser.queryObject(
    `INSERT INTO search_history (user_id, countries, year_range,created_at) VALUES (${userID}, ${countries}, ${yearRange}, NOW());`
  );
  return server.json({response: "Added to database"},200)
  } else{
      return server.json({response: "Missing necessary data"},404)
  }
}

export default async function getSearchResults(server){
    const {countries, indicators, yearRange} = await server.body

    const searchResponse = await clientUser.queryObject(`SELECT ShortName, IndicatorName, Value, Year, FROM Country 
    JOIN Indicators ON Indicators.CountryCode = Country.CountryCode
    WHERE ShortName = ${countries} && IndicatorName = ${indicators} && Year <= ${yearRange[0]} && Year >= ${yearRange[1]}`)

    const searchResult = searchResponse.rows
    server.json(searchResult)
    server.json({response: 'Search Complete'},200)
}
