import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../lib/mongodb";

export const getAppProps = async (ctx) => {
  // Grab the currently logged in user from Auth zero.
  const userSession = await getSession(ctx.req, ctx.res);
  const client = await clientPromise;
  const db = client.db("Blogener");
  const user = await db.collection("users").findOne({
    auth0id: userSession.user.sub,
  });

  // Check if logged in user has an associated user profile in MongoDB "users" collection.
  // If they don't have an associated profile - return the available tokens as zero.
  if (!user) {
    return {
      availableTokens: 0,
      posts: [],
    };
  }

  // Grab availables posts if user exist
  const posts = await db
    .collection("posts")
    .find({
      userId: user._id,
    })
    // imit posts to render
    .limit(7)
    // Sort posts from newest to oldest
    .sort({
      created: -1,
    })
    .toArray();

  return {
    availableTokens: user.availableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      created: created.toString(),
      ...rest,
    })),
    postId: ctx.params?.postId || null,
  };
};
