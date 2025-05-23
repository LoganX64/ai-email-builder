"use client";
import React, { useState } from "react";
import {
  useEmailTemplate,
  useSelectedElement,
  useDragElementLayout,
} from "@/app/provider";
import ButtonComponent from "../custom/ElementComponent/ButtonComponent";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";
import LogoComponent from "./LogoComponent";
import DividerComponent from "./DividerComponent";
import SocialIconsComponent from "./SocialIconsComponent";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";

const ColumnLayout = ({ layout }) => {
  const [dragOver, setDragOver] = useState(null);
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { dragElementLayout, setDragElementLayout } = useDragElementLayout();
  const { selectedElement, setSelectedElement } = useSelectedElement();

  if (!layout || !layout.id || !layout.numOfCol) {
    console.warn("Invalid layout provided:", JSON.stringify(layout, null, 2));
    return <div className="p-2 bg-red-100">Invalid layout</div>;
  }

  console.log("ColumnLayout - layout:", JSON.stringify(layout, null, 2));
  console.log(
    "ColumnLayout - emailTemplate:",
    JSON.stringify(emailTemplate, null, 2)
  );
  console.log(
    "ColumnLayout - current selectedElement:",
    JSON.stringify(selectedElement, null, 2)
  );

  const isLayoutSelected =
    selectedElement?.layout?.id && selectedElement.layout.id === layout.id;

  const onDragOverHandle = (event, index) => {
    event.preventDefault();
    setDragOver({ index, columnId: layout.id });
  };

  const onDropHandle = () => {
    if (
      !dragOver ||
      dragOver.index == null ||
      !dragElementLayout?.dragElement
    ) {
      console.warn(
        "Invalid drop state:",
        JSON.stringify({ dragOver, dragElementLayout }, null, 2)
      );
      setDragOver(null);
      return;
    }

    const { index } = dragOver;

    setEmailTemplate((prev) => {
      if (!prev || !Array.isArray(prev)) {
        console.warn(
          "emailTemplate is not an array:",
          JSON.stringify(prev, null, 2)
        );
        return prev;
      }

      const updatedTemplate = prev.map((col) => {
        if (!col || !col.id) {
          console.warn(
            "Invalid column in emailTemplate:",
            JSON.stringify(col, null, 2)
          );
          return col;
        }
        if (col.id !== layout.id) return col;

        const elements =
          col.elements ||
          Array.from({ length: col.numOfCol }, (_, i) => col[i]);
        const updatedElements = elements
          ? [...elements]
          : Array(layout.numOfCol).fill(null);
        updatedElements[index] = {
          ...dragElementLayout.dragElement,
          type: dragElementLayout.dragElement.type, // Preserve type
        };
        return { ...col, elements: updatedElements };
      });

      console.log(
        "onDropHandle - emailTemplate after update:",
        JSON.stringify(updatedTemplate, null, 2)
      );
      return updatedTemplate;
    });

    setDragOver(null);
    setDragElementLayout(null);
  };

  const GetElementComponent = (element) => {
    if (!element || !element.type) {
      return <div className="text-gray-400">Empty</div>;
    }

    const style = element.style || {};
    console.log(
      `GetElementComponent - ${element.type} style:`,
      JSON.stringify(style, null, 2)
    );

    switch (element.type) {
      case "Button":
        return (
          <ButtonComponent
            {...element}
            style={style}
            url={element.url || ""} // Handle empty URL
            content={element.content || "Click Me"} // Default content for button
          />
        );
      case "Text":
        return (
          <TextComponent
            {...element}
            style={style}
            content={element.content || ""} // Ensure empty content is handled
          />
        );
      case "Image":
        return <ImageComponent {...element} style={style} />;
      case "Logo":
        return <LogoComponent {...element} style={style} />;
      case "Divider":
        return <DividerComponent {...element} style={style} />;
      case "SocialIcons":
        return <SocialIconsComponent {...element} style={style} />;
      default:
        return <div style={style}>Unknown element type</div>;
    }
  };

  const deleteLayout = (layoutId) => {
    if (!layoutId || !emailTemplate) return;
    setEmailTemplate(emailTemplate.filter((item) => item?.id !== layoutId));
    setSelectedElement(null);
    console.log("ColumnLayout - deleted layout, cleared selectedElement");
  };

  const moveItemUp = (layoutId) => {
    if (!emailTemplate) return;
    const index = emailTemplate.findIndex((item) => item?.id === layoutId);
    if (index <= 0) return;
    setEmailTemplate((prev) => {
      const updated = [...prev];
      [updated[index], updated[index - 1]] = [
        updated[index - 1],
        updated[index],
      ];
      return updated;
    });
  };

  const moveItemDown = (layoutId) => {
    if (!emailTemplate) return;
    const index = emailTemplate.findIndex((item) => item?.id === layoutId);
    if (index === -1 || index >= emailTemplate.length - 1) return;
    setEmailTemplate((prev) => {
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [
        updated[index + 1],
        updated[index],
      ];
      return updated;
    });
  };

  return (
    <div className="relative">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${layout.numOfCol}, 1fr)`,
          gap: "0px",
          ...(layout.style || {}),
        }}
        className={`${isLayoutSelected ? "border border-dashed user-select-none border-blue-500" : ""}`}
      >
        {Array.from({ length: layout.numOfCol }).map((_, index) => {
          const isSelected =
            isLayoutSelected && selectedElement?.index === index;
          const isDragOver =
            dragOver?.index === index && dragOver?.columnId === layout.id;
          const element = layout.elements?.[index] || layout[index];

          console.log(
            `Column ${index} - element:`,
            JSON.stringify(element, null, 2)
          );
          console.log(
            `Column ${index} - outerStyle:`,
            JSON.stringify(element?.outerStyle, null, 2)
          );

          return (
            <div
              key={`${layout.id}-${index}`}
              className={`p-0 flex h-full w-full cursor-pointer
                ${!element?.type ? "bg-gray-100 border border-dashed" : ""}
                ${isDragOver ? "bg-green-100" : ""}
                ${isSelected ? "border-4 border-blue-500" : ""}`}
              onDragOver={(event) => onDragOverHandle(event, index)}
              onDrop={onDropHandle}
              onClick={() => {
                if (element?.type) {
                  const newSelected = {
                    element: element,
                    layout: layout,
                    index: index,
                  };
                  setSelectedElement(newSelected);
                  console.log(
                    "ColumnLayout - setSelectedElement:",
                    JSON.stringify(newSelected, null, 2)
                  );
                } else {
                  console.log(
                    "ColumnLayout - empty column clicked, no selection set"
                  );
                }
              }}
              style={{
                ...element?.outerStyle,
                display: element?.outerStyle?.display || "flex",
                alignItems: element?.outerStyle?.alignItems || "center",
                justifyContent:
                  element?.outerStyle?.justifyContent || "initial",
                backgroundColor:
                  element?.outerStyle?.backgroundColor || "transparent",
              }}
            >
              {element?.type
                ? GetElementComponent(element)
                : "Drag element here"}
            </div>
          );
        })}
      </div>

      {isLayoutSelected && (
        <div className="absolute -right-10 gap-2 flex flex-col">
          <div
            className="cursor-pointer bg-purple-100 p-2 rounded-full hover:scale-105 transition-all hover:shadow-md"
            onClick={() => deleteLayout(layout.id)}
          >
            <Trash className="h-4 w-4 text-red-500" />
          </div>
          <div
            className="cursor-pointer bg-gray-100 p-2 rounded-full hover:scale-105 transition-all hover:shadow-md"
            onClick={() => moveItemUp(layout.id)}
          >
            <ArrowUp className="h-4 w-4" />
          </div>
          <div
            className="cursor-pointer bg-gray-100 p-2 rounded-full hover:scale-105 transition-all hover:shadow-md"
            onClick={() => moveItemDown(layout.id)}
          >
            <ArrowDown className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnLayout;
