"use client";
import React, { useEffect, useState } from "react";
import { useSelectedElement, useEmailTemplate } from "@/app/provider";
import InputField from "./Settings/InputField";
import ColorPickerField from "./Settings/ColorPickerField";
import InputStyleField from "./Settings/InputStyleField";
import SliderField from "./Settings/SliderField";
import TextAreaField from "./Settings/TextAreaField";
import {
  AArrowUp,
  AlignCenter,
  AlignLeft,
  AlignRight,
  CaseLower,
  CaseUpper,
} from "lucide-react";
import ToggleGroupField from "./Settings/ToggleGroupField";
import DropDownField from "./Settings/DropDownField";
import ImagePreview from "./Settings/ImagePreview";

const TextAlignOptions = [
  { value: "left", icon: AlignLeft },
  { value: "center", icon: AlignCenter },
  { value: "right", icon: AlignRight },
];

const TextTransformOptions = [
  { value: "uppercase", icon: CaseUpper },
  { value: "lowercase", icon: CaseLower },
  { value: "capitalize", icon: AArrowUp },
];

const Settings = () => {
  const { selectedElement, setSelectedElement } = useSelectedElement();
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const [element, setElement] = useState(null);

  useEffect(() => {
    console.log(
      "Settings - received selectedElement:",
      JSON.stringify(selectedElement, null, 2)
    );
    if (selectedElement?.element) {
      console.log(
        "Settings - using selectedElement.element:",
        JSON.stringify(selectedElement.element, null, 2)
      );
      setElement(selectedElement.element);
    } else if (selectedElement?.layout && selectedElement.index != null) {
      const fallbackElement =
        selectedElement.layout.elements?.[selectedElement.index] ||
        selectedElement.layout[selectedElement.index];
      console.log(
        "Settings - fallback element from layout:",
        JSON.stringify(fallbackElement, null, 2)
      );
      setElement(fallbackElement || null);
    } else {
      console.log(
        "Settings - invalid selectedElement, setting element to null:",
        JSON.stringify(selectedElement, null, 2)
      );
      setElement(null);
    }
  }, [selectedElement]);

  const syncEmailTemplate = (updatedElement) => {
    const layoutToSync = selectedElement?.layout
      ? { ...selectedElement.layout }
      : null;
    console.log(
      "Settings - syncEmailTemplate - layoutToSync:",
      JSON.stringify(layoutToSync, null, 2)
    );
    if (!layoutToSync || !layoutToSync.id) {
      console.warn(
        "Settings - cannot sync, invalid layoutToSync:",
        JSON.stringify({ layoutToSync, updatedElement }, null, 2)
      );
      return;
    }
    setEmailTemplate((prev) => {
      if (!prev || !Array.isArray(prev)) {
        console.warn(
          "Settings - emailTemplate is not an array:",
          JSON.stringify(prev, null, 2)
        );
        return [];
      }
      const updated = prev
        .filter((col) => col && col.id)
        .map((col) => {
          if (col.id === layoutToSync.id) {
            const updatedElements = [
              ...(col.elements || Array(col.numOfCol).fill(null)),
            ];
            if (selectedElement.index != null && updatedElement.element) {
              updatedElements[selectedElement.index] = {
                ...updatedElement.element,
                type: updatedElement.element.type, // Preserve type
              };
            }
            return { ...col, elements: updatedElements };
          }
          return col;
        });
      console.log(
        "Settings - synced emailTemplate:",
        JSON.stringify(updated, null, 2)
      );
      return updated;
    });
  };

  const onHandleInputChange = (fieldName, value) => {
    if (
      !selectedElement ||
      selectedElement.index == null ||
      !selectedElement.layout ||
      !selectedElement.element
    ) {
      console.warn(
        "Settings - invalid selectedElement for input change:",
        JSON.stringify(selectedElement, null, 2)
      );
      return;
    }
    const updatedElement = {
      ...selectedElement,
      element: {
        ...selectedElement.element,
        [fieldName]: value, // Allow empty string for content/url
        type: selectedElement.element.type, // Ensure type is preserved
      },
      layout: {
        ...selectedElement.layout,
        elements: [
          ...(selectedElement.layout.elements ||
            Array(selectedElement.layout.numOfCol).fill(null)),
        ],
      },
    };
    updatedElement.layout.elements[selectedElement.index] = {
      ...updatedElement.element,
      [fieldName]: value,
      type: updatedElement.element.type, // Preserve type
    };
    setSelectedElement(updatedElement);
    syncEmailTemplate(updatedElement);
    console.log(`Settings - onHandleInputChange - ${fieldName}:`, value);
  };

  const onHandleOuterStyleChange = (fieldName, fieldValue) => {
    if (
      !selectedElement ||
      selectedElement.index == null ||
      !selectedElement.layout
    ) {
      console.warn(
        "Settings - invalid selectedElement for outer style change:",
        JSON.stringify(selectedElement, null, 2)
      );
      return;
    }
    const updatedElement = {
      ...selectedElement,
      element: {
        ...selectedElement.element,
        outerStyle: {
          ...selectedElement.element?.outerStyle,
          [fieldName]: fieldValue,
        },
      },
      layout: {
        ...selectedElement.layout,
        elements: [...(selectedElement.layout.elements || [])],
        [selectedElement.index]: {
          ...selectedElement.layout[selectedElement.index],
          outerStyle: {
            ...selectedElement.layout[selectedElement.index]?.outerStyle,
            [fieldName]: fieldValue,
          },
        },
      },
    };
    setSelectedElement(updatedElement);
    syncEmailTemplate(updatedElement);
    console.log(
      `Settings - onHandleOuterStyleChange - ${fieldName}:`,
      fieldValue
    );
  };

  const onHandleStyleChange = (fieldName, fieldValue) => {
    if (
      !selectedElement ||
      selectedElement.index == null ||
      !selectedElement.layout
    ) {
      console.warn(
        "Settings - invalid selectedElement for style change:",
        JSON.stringify(selectedElement, null, 2)
      );
      return;
    }
    const updatedElement = {
      ...selectedElement,
      element: {
        ...selectedElement.element,
        style: {
          ...selectedElement.element?.style,
          [fieldName]: fieldValue,
        },
      },
      layout: {
        ...selectedElement.layout,
        elements: [...(selectedElement.layout.elements || [])],
        [selectedElement.index]: {
          ...selectedElement.layout[selectedElement.index],
          style: {
            ...selectedElement.layout[selectedElement.index]?.style,
            [fieldName]: fieldValue,
          },
        },
      },
    };
    setSelectedElement(updatedElement);
    syncEmailTemplate(updatedElement);
    console.log(`Settings - onHandleStyleChange - ${fieldName}:`, fieldValue);
  };

  return (
    <div className="p-5 flex flex-col gap-4">
      <h2 className="font-bold text-xl">Settings</h2>
      {!element ? (
        <p className="text-gray-500">Select an element to edit its settings.</p>
      ) : (
        <>
          <p className="text-gray-600">
            Debug: Element Type - {element.type || "Unknown"}
          </p>
          {element.imageUrl && (
            <ImagePreview
              label="Image Preview"
              value={element.imageUrl}
              onHandleInputChange={(value) =>
                onHandleInputChange("imageUrl", value)
              }
            />
          )}
          {/* Always render content field, even if empty */}
          <InputField
            label="Content"
            value={element.content || ""}
            onHandleInputChange={(value) =>
              onHandleInputChange("content", value)
            }
          />
          {element.textarea && (
            <TextAreaField
              label="Text Area"
              value={element.textarea || ""}
              onHandleInputChange={(value) =>
                onHandleInputChange("textarea", value)
              }
            />
          )}
          {/* Always render url field, even if empty */}
          {element.url !== undefined && (
            <InputField
              label="URL"
              value={element.url || ""}
              onHandleInputChange={(value) => onHandleInputChange("url", value)}
            />
          )}
          {/* Always render text align field if style exists */}
          {element.style && (
            <ToggleGroupField
              label="Text Align"
              value={element.style.textAlign || "left"} // Default to "left" if undefined
              options={TextAlignOptions}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("textAlign", value)
              }
            />
          )}
          {element.style?.backgroundColor && (
            <ColorPickerField
              label="Background Color"
              value={element.style.backgroundColor ?? "#000000"}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("backgroundColor", value)
              }
            />
          )}
          {element.style?.color && (
            <ColorPickerField
              label="Text Color"
              value={element.style.color}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("color", value)
              }
            />
          )}
          {element.style?.fontSize && (
            <InputStyleField
              label="Font Size"
              value={element.style.fontSize}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("fontSize", value)
              }
            />
          )}
          {element.style?.textTransform && (
            <ToggleGroupField
              label="Text Transform"
              value={element.style.textTransform}
              options={TextTransformOptions}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("textTransform", value)
              }
            />
          )}
          {element.style?.padding && (
            <InputStyleField
              label="Padding"
              value={element.style.padding}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("padding", value)
              }
            />
          )}
          {element.style?.margin && (
            <InputStyleField
              label="Margin"
              value={element.style.margin}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("margin", value)
              }
            />
          )}
          {element.style?.borderRadius && (
            <SliderField
              label="Border Radius"
              value={element.style.borderRadius}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("borderRadius", value)
              }
            />
          )}
          {element.style?.fontWeight && (
            <DropDownField
              label="Font Weight"
              value={element.style.fontWeight}
              options={["normal", "bold"]}
              onHandleStyleChange={(value) =>
                onHandleStyleChange("fontWeight", value)
              }
            />
          )}
          {element.style?.width && (
            <SliderField
              label="Width"
              value={element.style.width}
              type="%"
              onHandleStyleChange={(value) =>
                onHandleStyleChange("width", value)
              }
            />
          )}
          <div>
            <h2 className="font-bold mb-2">Outer Style</h2>
            {element.outerStyle?.backgroundColor && (
              <ColorPickerField
                label="Background Color"
                value={element.outerStyle.backgroundColor}
                onHandleStyleChange={(value) =>
                  onHandleOuterStyleChange("backgroundColor", value)
                }
              />
            )}
            {/* Always render align field if outerStyle exists */}
            {element.outerStyle && (
              <ToggleGroupField
                label="Align"
                value={element.outerStyle.justifyContent || "initial"} // Default to "initial" if undefined
                options={TextAlignOptions}
                onHandleStyleChange={(value) =>
                  onHandleOuterStyleChange("justifyContent", value)
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
