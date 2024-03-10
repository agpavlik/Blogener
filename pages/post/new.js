import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";

export default function NewPost(props) {
  console.log(props);
  return (
    <div>
      <h1>NewPost</h1>
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
