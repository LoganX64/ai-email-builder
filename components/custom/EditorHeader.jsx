"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Code, Monitor, Phone } from "lucide-react";
import { useScreenSize } from "@/app/provider";

const EditorHeader = () => {
  const { screenSize, setScreenSize } = useScreenSize();
  return (
    <div className="p-4 shadow-sm flex justify-between items-center">
      <Image src={"/logo.svg"} alt="logo" width={60} height={60}></Image>

      <div className="flex gap-3">
        <Button
          onClick={() => setScreenSize("desktop")}
          variant="ghost"
          className={`${screenSize == "desktop" && "bg-purple-100 text-primary"}`}
        >
          <Monitor />
          Desktop
        </Button>
        <Button
          onClick={() => setScreenSize("mobile")}
          variant="ghost"
          className={`${screenSize == "mobile" && "bg-purple-100 text-primary"}`}
        >
          <Phone />
          Mobile
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" className="hover:text-primary">
          <Code />
        </Button>
        <Button variant="outline">Send Test Email</Button>
        <Button>Save Template</Button>
      </div>
    </div>
  );
};

export default EditorHeader;
