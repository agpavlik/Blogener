import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const topic = "dog ownership";
  const keywords = "first-time dog owner, puppy diet";

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called Blogener. You are designed to output markdown without frontmatter.",
      },
      {
        role: "user",
        content: `Generate me a long and detailed SEO friendly blog post on the following topic delimited by triple hyphens : 
        ---
        ${topic}
        ---
        Targeting the following comma separated keywords delimited by triple hyphens:
        ---
        ${keywords}
        ---
        `,
      },
    ],
  });

  res
    .status(200)
    .json({ postContent: response.data.choices[0]?.message?.content });
}
