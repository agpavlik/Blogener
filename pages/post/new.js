import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import Markdown from "react-markdown"; //

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  // Query API endpoint for generatePost
  const handleSubmit = async (e) => {
    e.preventDefault();
    //setGenerating(true);
    // try {
    const response = await fetch(`/api/generatePost`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topic, keywords }),
    });
    const json = await response.json();
    console.log("RESULT: ", json);
    setPostContent(json.post.postContent);
    //   if (json?.postId) {
    //     router.push(`/post/${json.postId}`);
    //   }
    // } catch (e) {
    //   //setGenerating(false);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="m-auto w-full max-w-screen-sm bg-zinc-100 p-4 rounded-md shadow-xl border border-zinc-300 shadow-zinc-300"
      >
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className="resize-none border border-zinc-500 w-full block my-3 px-4 py-2 rounded-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={80}
          />
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="resize-none border border-zinc-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            maxLength={80}
          />
          <small className="block mb-4">* Separate keywords with a comma</small>
        </div>
        <button
          type="submit"
          className="btn"
          disabled={!topic.trim() || !keywords.trim()}
        >
          Generate
        </button>
      </form>

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
