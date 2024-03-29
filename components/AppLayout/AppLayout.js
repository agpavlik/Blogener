import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";

import { Logo } from "../Logo/Logo";
import PostsContext from "../../context/postsContext";
import { useContext, useEffect } from "react";

export const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreated,
}) => {
  const { user } = useUser();

  // console.log("APP PROPS:", rest);

  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    // Check if a postId is set and than check if the postId exists in initial loading of posts from SSR.
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  return (
    <div className="grid md:grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-zinc-800 px-2">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/post/new" className="btn">
            <FontAwesomeIcon icon={faFileCirclePlus} />
            &nbsp;&nbsp; New post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-400" />
            <span className="pl-2 text-blue-300 hover:text-white">
              {availableTokens} tokens available
            </span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-zinc-800 to-teal-800">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 hover:bg-white/20 cursor-pointer rounded-sm
              ${
                postId === post._id
                  ? "bg-teal-900 border-white hover:bg-teal-700"
                  : ""
              }`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              onClick={() => {
                getPosts({ lastPostDate: posts[posts.length - 1].created });
              }}
              className="hover:text-white text-zinc-400 text-center cursor-pointer mt-4"
            >
              <FontAwesomeIcon icon={faAnglesDown} />
              &nbsp;&nbsp; Load more posts
            </div>
          )}
        </div>
        <div className="bg-teal-800 flex items-center gap-2 border-t border-t-black/50 xs:h-15 md:h-20 px-2">
          {!!user ? (
            <>
              <div className="xs:max-w-[35px] md:max-w-[60px] xs:mx-5 md:px-2">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout&nbsp;&nbsp;
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
