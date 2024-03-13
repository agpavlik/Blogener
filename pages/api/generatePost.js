import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

// With the withApiAuthRequired higher-order function, you can require authentication to access the API route.
// If the user is not authenticated, they are redirected to the login page.
export default withApiAuthRequired(async function handler(req, res) {
  try {
    // Grab the currently logged in users ID from Auth0.
    const { user } = await getSession(req, res);

    // Connect to MongoDB and dtabase
    const client = await clientPromise;
    const db = client.db("Blogener");

    const userProfile = await db
      .collection("users")
      .findOne({ auth0Id: user.sub });

    // If a user profile is not already created, then it means they
    // haven't purchased any tokens yet. Also, if available tokens is zero,
    // then return an error.
    if (!userProfile?.availableTokens) {
      res.status(403);
      return;
    }

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(config);

    const { topic, keywords } = req.body;

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

    const postContent = response.data.choices[0]?.message.content;

    const seoResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are an SEO friendly blog post generator called Blogener. You are designed to output JSON. Do not include HTML tags in your output.",
        },
        {
          role: "user",
          content: `Generate an SEO friendly title and SEO friendly meta description for the following blog post.
        ${postContent}
        ---
        The output json must be in the following format:
        {title: "example title",
        metaDescription: "example meta description" }
        `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const { title, metaDescription } =
      seoResponse.data.choices[0]?.message?.content || {};

    // Once blog post was generated, then decrement the user's available tokens by one.
    await db.collection("users").updateOne(
      { auth0id: user.sub },
      {
        $inc: {
          availableTokens: -1,
        },
      }
    );

    // Insert generated post into the posts collection.
    // Add all important info: topic, keywords, date, user etc.
    const post = await db.collection("posts").insertOne({
      postContent,
      title,
      metaDescription,
      topic,
      keywords,
      userId: userProfile._id,
      created: new Date(),
    });

    console.log("Successfully generated post:", post);

    res.status(200).json({
      post: {
        postContent,
        title,
        metaDescription,
      },
    });
  } catch (e) {
    res.status(500).send("error caught");
  }
});
