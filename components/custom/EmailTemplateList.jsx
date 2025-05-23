import Image from "next/image";
import React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
const EmailTemplateList = () => {
  const [emailLists, setEmailList] = useState([]);
  return (
    <div>
      <h2 className="font-bold text-xl mt-6 text-primary">Workspace</h2>
      {emailLists?.length == 0 && (
        <div className="flex justify-center mt-7 flex-col items-center">
          <Image
            src={"/email-consent.svg"}
            alt="email"
            width={250}
            height={250}
          ></Image>
          <Button className="mt-7">+Create New</Button>
        </div>
      )}
    </div>
  );
};

export default EmailTemplateList;
