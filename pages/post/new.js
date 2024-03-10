import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function NewPost(props) {
  console.log(props);
  return (
    <div>
      <h1>NewPost</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
