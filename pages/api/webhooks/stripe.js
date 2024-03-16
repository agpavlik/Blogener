// Package allows external entities to call that endpoint.
import Cors from "micro-cors";

import stripeInit from "stripe";

// Package allows to check if the request method cames from Stripe is equal to POST.
import verifyStripe from "@webdeveducation/next-verify-stripe";

import clientPromise from "../../../lib/mongodb";

// Set up an endpoint for Stripe to call whenever a payment was successful.
// Allow Stripe to post to our web hook endpoint.
const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

// Pass the API object and the body parser to be able to read the raw data
// that was sent from Stripe.
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Handler for endpoint
const handler = async (req, res) => {
  if (req.method === "POST") {
    let event;
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret,
      });
    } catch (e) {
      console.log("ERROR: ", e);
    }

    // listen for the succesfull paymant event
    switch (event.type) {
      case "payment_intent.succeeded": {
        // Connect to MongoDB and database
        const client = await clientPromise;
        const db = client.db("Blogener");

        // We should have access on the auth0id for the particular user that made purchase.
        // Grab the data
        const paymentIntent = event.data.object;
        const auth0id = paymentIntent.metadata.sub;

        console.log("AUTH 0 ID: ", paymentIntent);

        //Identify document to update. Check if any documents that has auth0id equal to user.sub.
        // Then update that document. If that document doesn't exist, then MongoDB will create that document.
        const userProfile = await db
          .collection("users")
          .updateOne(
            { auth0id },
            { $inc: { availableTokens: 10 }, $setOnInsert: { auth0id } },
            { upsert: true }
          );
      }
      default:
        console.log("UNHANDLED EVENT: ", event.type);
    }
    res.status(200).json({ received: true });
  }
};

export default cors(handler);
