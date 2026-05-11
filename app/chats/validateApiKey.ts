export const validateApiKey = async (
  apiKey: string,
  endpointUrl: string,
  model: string,
): Promise<boolean> => {
  try {
    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: "Say 'ok' if this API key works.",
          },
        ],
        max_tokens: 5,
        thinking: { type: "disabled" },
        reasoning: { enabled: false },
      }),
    });

    if (response.status !== 200) {
      console.log("API key validation failed");
      return false;
    }

    const data = await response.json();
    console.log("API validation response:", data.choices?.[0]?.message);
    return (
      !!data?.choices?.[0]?.message?.content ||
      !!data?.choices?.[0]?.message?.reasoning_content ||
      !!data?.choices?.[0]?.message?.reasoning
    );
  } catch (error) {
    return false;
  }
};
