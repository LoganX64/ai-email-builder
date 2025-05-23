"use client";
import { Divide } from "lucide-react";
import React from "react";
import Layout from "@/Data/Layout";
import ElementList from "@/Data/ElementList";
import ElementLayoutCard from "./ElementLayoutCard";
import { useDragElementLayout } from "@/app/provider";

const ElementsSideBar = () => {
  const { dragElementLayout, setDragElementLayout } = useDragElementLayout();
  const onDragLayoutStart = (layout) => {
    console.log(layout);
    setDragElementLayout({
      dragLayout: {
        ...layout,
        id: Date.now(),
      },
    });
  };

  const onDragElementStart = (element) => {
    setDragElementLayout({
      dragElement: {
        ...element,
        id: Date.now(),
      },
    });
  };

  return (
    <div className="p-5 h-screen shadow-sm">
      <h2 className="font-bold text-lg">Layouts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Layout.map((layout, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => onDragLayoutStart(layout)}
          >
            <ElementLayoutCard layout={layout} key={index} />
          </div>
        ))}
      </div>
      <h2 className="font-bold text-lg mt-6">Elements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ElementList.map((element, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => onDragElementStart(element)}
          >
            <ElementLayoutCard layout={element} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElementsSideBar;
