import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo/Logo";

export const AppLayout = ({ children, availableTokens, posts, postId }) => {
  const { user } = useUser();

  // console.log("APP PROPS:", rest);

  return (
    <div className="grid md:grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-zinc-800 px-2">
          <Logo />
          <Link href="/post/new" className="btn">
            New post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-400" />
            <span className="pl-2 hover:text-blue-300">
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
                  ? "bg-teal-800 border-white hover:bg-teal-800"
                  : ""
              }`}
            >
              {post.topic}
            </Link>
          ))}
        </div>
        <div className="bg-teal-800 flex items-center gap-2 border-t border-t-black/50 xs:h-10 md:h-20 px-2">
          {!!user ? (
            <>
              <div className="md:min-w-[50px] xs:max-w-[35px] xs:mx-5 md:px-2">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="md:flex-1 xs:flex">
                <div className="font-bold">{user.email}</div>
                <Link
                  className="text-sm xs:mx-20 md-px-2"
                  href="/api/auth/logout"
                >
                  Logout
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
