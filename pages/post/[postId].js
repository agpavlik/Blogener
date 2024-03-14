import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default function Post(props) {
  console.log("Props", props);
  return (
    <div>
      <h1>Post</h1>
    </div>
  );
}

// Implement AppLayout for current page
// Function getLayout returns the app layout, which expects
// two arguments (page to render and any pageProps.
Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

// With the withPageAuthRequired higher-order function, we can require authentication to access the exact page.
// If the user is not authenticated, they are redirected to the login page.
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    // const props = await getAppProps(ctx);

    // Grab the currently logged in users ID from Auth0.
    const userSession = await getSession(ctx.req, ctx.res);

    // Connect to MongoDB and database
    const client = await clientPromise;
    const db = client.db("Blogener");

    const user = await db.collection("users").findOne({
      auth0id: userSession.user.sub,
    });

    // Grab post by id.
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    // If post does not exist - redirect to the nea page
    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        id: ctx.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        // postCreated: post.created.toString(),
        // ...props,
      },
    };
  },
});
