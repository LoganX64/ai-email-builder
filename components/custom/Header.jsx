"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import SignInButton from "./SignInButton";
import { useUserDetail } from "@/app/provider";
import Link from "next/link";
const Header = () => {
  const { userDetail, setUserDetail } = useUserDetail();
  return (
    <div className="flex justify-between items-center p-4 shadow-sm px-10">
      <Image src={"/logo.svg"} alt="Logo" width={60} height={60}></Image>
      <div>
        {userDetail?.email ? (
          <div className="flex gap-3 items-center">
            <Link href={"/dashboard"}>
              <Button>Dashboard</Button>
            </Link>
            <Image
              className="rounded-full"
              src={userDetail?.picture}
              alt="user"
              width={35}
              height={35}
            />
          </div>
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  );
};

export default Header;
