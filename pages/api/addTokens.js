import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  // Logic: check to see if a user has a profile already stored in database.
  // If they don't have a profile, then create one and add some tokens.
  // If they already have a profile, then just add some tokens to that profile.

  // Grab the currently logged in users ID from Auth0.
  const { user } = await getSession(req, res);

  // Connect to MongoDB and database
  const client = await clientPromise;
  const db = client.db("Blogener");

  //Identify document to update. Check if any documents that has auth0id equal to user.sub.
  // Then update that document. If that document doesn't exist, then MongoDB will create that document.

  const userProfile = await db
    .collection("users")
    .updateOne(
      { auth0id: user.sub },
      { $inc: { availableTokens: 25 }, $setOnInsert: { auth0id: user.sub } },
      { upsert: true }
    );
  console.log("user.sub:", user.sub);

  console.log("userProfile:", userProfile);
  res.status(200).json({ name: "John Doe" });
}
