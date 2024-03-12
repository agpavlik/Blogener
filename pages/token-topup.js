import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopup() {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    // const json = await result.json();
    // console.log("RESULT: ", json);
    // window.location.href = json.session.url;
  };

  return (
    <div>
      <h1>Token</h1>
      <button className="btn" onClick={handleClick}>
        Add tokens
      </button>
    </div>
  );
}

// Implement AppLayout for current page
// Function getLayout returns the app layout, which expects
// two arguments (page to render and any pageProps.
TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
