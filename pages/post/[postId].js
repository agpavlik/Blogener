import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import Markdown from "react-markdown";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {
  console.log("PROPS:", props);
  return (
    <div className="overflow-auto h-full">
      <div className="xs:w-4/5 sm:w-4/5 md:w-2/3 lg:w-2/3 mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-zinc-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-zinc-200 rounded-md">
          <div className="text-teal-700 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-zinc-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(",").map((keyword, i) => (
            <div
              key={i}
              className="py-1 px-2 rounded-full bg-teal-800 text-white"
            >
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-zinc-200 rounded-sm">
          Blog post
        </div>
        <Markdown>{props.postContent || ""}</Markdown>
      </div>
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
    const props = await getAppProps(ctx);

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
        ...props,
      },
    };
  },
});
