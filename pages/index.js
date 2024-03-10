import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function Home() {
  const { user } = useUser();

  console.log(user);
  return (
    <div>
      Homepage
      <div>
        {!!user ? (
          <>
            <div>
              <Image
                src={user.picture}
                alt={user.name}
                height={50}
                width={50}
                className="absolute"
              />
              <div>{user.email}</div>
            </div>
            <Link href="/api/auth/logout" className="btn text-left">
              Logout
            </Link>
          </>
        ) : (
          <Link href="/api/auth/login" className="btn text-left">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
