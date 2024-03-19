import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Roboto, DM_Serif_Display } from "@next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { PostsProvider } from "../context/postsContext";
config.autoAddCss = false;

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmSerifDisplay = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

function MyApp({ Component, pageProps }) {
  // Check if component get layout. Then render layout passing down the component as the children for that layout.
  // If a particular page doesn't have a getLayout function associated with it, will return the components to render.
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <UserProvider>
      <PostsProvider>
        <main
          className={`${roboto.variable} ${dmSerifDisplay.variable} font-body`}
        >
          {getLayout(<Component {...pageProps} />, pageProps)}
        </main>
      </PostsProvider>
    </UserProvider>
  );
}

export default MyApp;
