export async function analyzeFood(foodText, apiKey) {
  if (!apiKey) throw new Error("No API key provided");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a nutrition assistant focusing on MCAS, histamine intolerance, SIBO, FODMAPs, gluten, dyes/additives, lactose, fructose, and complex carbohydrates. Always return results in strict JSON format, no extra commentary." 
        },
        { 
          role: "user", 
          content: `Analyze the following food and output in this JSON structure:

									{
										type: "Food",
										identifiedIngredients: [...],
										likelyPreparationTechniques: [...],
										sensitivities: [
											{ 
												ingredientName: <ingredient>, 
												histamineContentNumericalEstimateRangeStart: <number with units like micrograms/L>, 
												histamineContentNumericalEstimateRangeEnd: <number with units like micrograms/L>, 
												histamineContentLowMedHigh: Low|Med|High, 
												histamineLiberator: Yes|No,
												fodmapCategory: Low|Med|High|Unknown,
												glutenContent: Present|Absent|Unknown,
												dyesOrAdditives: Present|Absent|Unknown,
												lactoseContent: Low|Med|High|Absent|Unknown,
												fructoseContent: Low|Med|High|Unknown,
												complexCarbohydrates: Low|Med|High|Unknown
											}
										]
									}

									Food: ${foodText}`
        }
      ],
      temperature: 0
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error: ${err}`);
  }

  const json = await response.json();
  const content = json.choices[0].message.content;

  try {
    // Parse the result into JSON
    const parsed = JSON.parse(content);
		parsed.userText = foodText;
    return parsed;
  } catch (err) {
    throw new Error(`Failed to parse JSON: ${err.message}\nModel output was: ${content}`);
  }
}
