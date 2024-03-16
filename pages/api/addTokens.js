import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import stripeInit from "stripe";

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Logic: check to see if a user has a profile already stored in database.
  // If they don't have a profile, then create one and add some tokens.
  // If they already have a profile, then just add some tokens to that profile.

  // Grab the currently logged in users ID from Auth0.
  const { user } = await getSession(req, res);

  // Call stripe API
  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1,
    },
  ];

  // Check to see which domain name ad tokens endpoint was requested from to determine
  // which URL to navigate back to.
  const protocol =
    process.env.NODE_ENV === "development" ? "http://" : "https://";
  // Determine the host. Grab it from request headers.
  const host = req.headers.host;

  // Checkout session contains a form where the user can fill in their payment details
  // to pay for the product they're purchasing.
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/success`,
    // payment_intent_data: {
    //   metadata: {
    //     sub: user.sub,
    // //   },
    // },
    // metadata: {
    //   sub: user.sub,
    // },
  });

  // Connect to MongoDB and database
  const client = await clientPromise;
  const db = client.db("Blogener");

  //Identify document to update. Check if any documents that has auth0id equal to user.sub.
  // Then update that document. If that document doesn't exist, then MongoDB will create that document.

  const userProfile = await db
    .collection("users")
    .updateOne(
      { auth0id: user.sub },
      { $inc: { availableTokens: 10 }, $setOnInsert: { auth0id: user.sub } },
      { upsert: true }
    );

  res.status(200).json({ session: checkoutSession });
}
