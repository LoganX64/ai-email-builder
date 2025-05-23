import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import SignInButton from "./SignInButton";

const Hero = () => {
  return (
    <div className="px-10 md-28 lg:px-44 xl:56 flex flex-col items-center mt-20">
      <h2 className="font-bold text-5xl text-center">
        AI-Powered Email Templates
      </h2>
      <p className="text-center mt-4">
        Longing to impress clients with AI-powered emails but don't have enough
        time to build tem on your own?
      </p>
      <div className="flex gap-5 mt-6">
        <Button variant="outline">Try Demo</Button>
        <SignInButton></SignInButton>
      </div>
      <Image
        src={"/email-campaign.svg"}
        width={500}
        height={500}
        alt="Logo"
        className="mt-12 rounded-xl"
      />
    </div>
  );
};

export default Hero;
