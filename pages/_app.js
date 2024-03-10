import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";

function MyApp({ Component, pageProps }) {
  // Check if component get layout. Then render layout passing down the component as the children for that layout.
  // If a particular page doesn't have a getLayout function associated with it, will return the components to render.
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <UserProvider>
      {getLayout(<Component {...pageProps} />, pageProps)}
    </UserProvider>
  );
}

export default MyApp;
