import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    const json = await result.json();
    console.log("RESULT: ", json);
    // Navigate to newly genereted stripe checkout URL.
    window.location.href = json.session.url;
  };

  return (
    <div className="w-full h-full flex flex-col overflow-auto p-3">
      <div className="m-auto w-full max-w-screen-mdl bg-zinc-100 p-4 rounded-md shadow-xl border border-zinc-300 shadow-zinc-300">
        <p className="pb-2">Please, buy some tokens to create new posts</p>
        <button className="btn" onClick={handleClick}>
          Add tokens
        </button>
      </div>
    </div>
  );
}

// Implement AppLayout for current page
// Function getLayout returns the app layout, which expects
// two arguments (page to render and any pageProps.
TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
