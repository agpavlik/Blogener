import Link from "next/link";
import { Logo } from "../components/Logo/Logo";
import Image from "next/image";
import HeroImage from "../public/let11.jpeg";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePos, setMousePos] = useState({});
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative px-2">
      <Image className="relative " src={HeroImage} alt="Letters" fill />
      <div className="relative z-10 text-white xs:px-5 md:px-10 py-5 text-center max-w-screen-md bg-teal-900/80 rounded-md backdrop-blur-sm">
        <Logo />
        <p className="pb-3">
          The AI-powered SAAS solution to generate SEO-optimized blog posts in
          minutes. Get high-quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" className="btn">
          Begin
        </Link>
      </div>
    </div>
  );
}
