import { createFileRoute } from "@tanstack/react-router";

import { SiFarcaster } from "react-icons/si";
import { FaSquare } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";

import { Overlay } from "../features/home/Overlay";
import Header from "../components/Header";

import { useState } from "react";
import { createFetchClient } from "@nora-health/api-client";

const client = createFetchClient(import.meta.env.VITE_SERVER_URL);

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [email, setEmail] = useState<string>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleSubmit = async () => {
    const res = await client.request("post", "/waitlist", {
      body: { email: email as string },
    });
    console.log(res.data);
    if (res.error) {
      res.error._tag;
    }
    setEmail("");
    setIsSubmit(true);
  };

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col items-center">
      <Header />
      <div className="absolute inset-0 z-5 opacity-10 dark:opacity-20 pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] dark:bg-[radial-gradient(#fffffff_1,transparent_1px)] [background-size:24px_24px] h-[100%]"></div>
      <div className="absolute top-0 bg-cover md:rotate-180 bg-no-repeat w-full h-full bg-[url('/wave.svg')]"></div>
      <div className="md:my-40 z-10 my-15 text-center">
        <h1 className="text-5xl font-bold text-black">
          Focus on what really matters creating :)
        </h1>
        <div className="mt-15 relative z-10">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="bg-gray-300 text-black  outline-none opacity-100 p-4 w-[60%] rounded-full "
            placeholder="Your email"
            style={{ opacity: "1" }}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="p-4 bg-black hover:scale-110 transition rounded-full px-6 w-max cursor-pointer ml-2 font-bold"
          >
            Join us
          </button>
        </div>
        <div className="relative text-black  flex flex-row justify-center items-center text-center p-4 w-full mt-4">
          <SiFarcaster
            size={42}
            className="text-purple-700 hover:scale-110 transition"
          />
          <FaSquare
            size={42}
            className="mx-4 text-blue-600 hover:scale-110 transition"
          />
          <FaFacebookSquare
            size={42}
            className="text-blue-600 hover:scale-110 transition"
          />
          <BiLogoInstagramAlt
            size={42}
            className="mx-4 text-pink-600 hover:scale-110 transition"
          />
          <BsTwitterX size={38} className="hover:scale-110 transition" />
        </div>
        <div className="md:mt-25 mt-10  flex flex-row justify-center w-full">
          <p className="md:text-gray-500 text-white mx-auto">
            Copyright nora-health 2026
          </p>
        </div>
      </div>
      {isSubmit && <Overlay />}
    </div>
  );
}
