import React from "react";

const ElementLayoutCard = ({ layout }) => {
  return (
    <div className=" mt-3 flex flex-col items-center justify-center border border-dashed rounded-xl p-3 group hover:shadow-md hover:border-primary cursor-pointer">
      {
        <layout.icon className="p-2 h-8 w-8 bg-gray-100 group-hover:text-purple-500 group-hover:bg-purple-100 rounded-full" />
      }
      <h2 className="text-sm group-hover:text-purple-500">{layout.label}</h2>
    </div>
  );
};

export default ElementLayoutCard;
