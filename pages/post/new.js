import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown";

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");

  // Query API endpoint for generatePost
  const handleClick = async () => {
    // e.preventDefault();
    //setGenerating(true);
    // try {
    const response = await fetch(`/api/generatePost`, {
      method: "POST",
      // headers: {
      //   "content-type": "application/json",
      // },
      // body: JSON.stringify({ topic, keywords }),
    });
    const json = await response.json();
    console.log("RESULT: ", json);
    setPostContent(json.postContent);
    //   if (json?.postId) {
    //     router.push(`/post/${json.postId}`);
    //   }
    // } catch (e) {
    //   //setGenerating(false);
  };

  return (
    <div>
      <h1>NewPost</h1>
      <button className="btn" onClick={handleClick}>
        Generate
      </button>
      <Markdown>{postContent}</Markdown>
    </div>
  );
}

// Implement AppLayout for current page
// Function getLayout returns the app layout, which expects
// two arguments (page to render and any pageProps.
NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
