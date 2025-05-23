"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { useContext, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";

import { UserDetailContext } from "@/context/UserDetailContext";
import { ScreenSizeContext } from "@/context/ScreenSizeContext";
import { DragDropLayoutElement } from "@/context/DragDropLayoutElement";
import { EmailTemplateContext } from "@/context/EmailTemplateContext";
import { jsonToConvex } from "convex/values";
import { SelectedElementContext } from "@/context/SelectedElement";

function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  const [userDetail, setUserDetail] = useState();
  const [screenSize, setScreenSize] = useState("desktop");
  const [dragElementLayout, setDragElementLayout] = useState();
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    try {
      const storage = JSON.parse(localStorage.getItem("userDetail") || "{}");
      const emailTemplateStorage = JSON.parse(
        localStorage.getItem("emailTemplate") || "[]"
      );
      // Filter out null/undefined items and ensure each item has an id
      const sanitizedTemplates = Array.isArray(emailTemplateStorage)
        ? emailTemplateStorage.filter((item) => item && item.id)
        : [];
      setEmailTemplate(sanitizedTemplates);
      console.log(
        "Provider - initialized emailTemplate:",
        JSON.stringify(sanitizedTemplates, null, 2)
      );
      if (!storage?.email || !storage) {
        // redirect to home screen
      } else {
        setUserDetail(storage);
      }
    } catch (error) {
      console.error("Provider - failed to parse localStorage:", error);
      setEmailTemplate([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("emailTemplate", JSON.stringify(emailTemplate));
      } catch (error) {
        console.error(
          "Provider - failed to save emailTemplate to localStorage:",
          error
        );
      }
    }
  }, [emailTemplate]);

  useEffect(() => {
    if (
      selectedElement?.element &&
      selectedElement?.layout?.id &&
      selectedElement?.index != null
    ) {
      console.log(
        "Provider - received selectedElement:",
        JSON.stringify(selectedElement, null, 2)
      );
      const updatedEmailTemplates = emailTemplate
        .filter((item) => item && item.id) // Ensure no null items
        .map((item) => {
          if (!item || !item.id) return item;
          if (item.id === selectedElement.layout.id) {
            const updatedElements = item.elements
              ? [...item.elements]
              : Array.from(
                  { length: item.numOfCol },
                  (_, i) => item[i] || null
                );
            updatedElements[selectedElement.index] = selectedElement.element;
            return { ...item, elements: updatedElements };
          }
          return item;
        });
      setEmailTemplate(updatedEmailTemplates);
      console.log(
        "Provider - updated emailTemplate:",
        JSON.stringify(updatedEmailTemplates, null, 2)
      );
    } else {
      console.log(
        "Provider - no valid selectedElement for sync:",
        JSON.stringify(selectedElement, null, 2)
      );
    }
  }, [selectedElement]);

  return (
    <ConvexProvider client={convex}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <ScreenSizeContext.Provider value={{ screenSize, setScreenSize }}>
            <DragDropLayoutElement.Provider
              value={{ dragElementLayout, setDragElementLayout }}
            >
              <EmailTemplateContext.Provider
                value={{ emailTemplate, setEmailTemplate }}
              >
                <SelectedElementContext.Provider
                  value={{ selectedElement, setSelectedElement }}
                >
                  <div>{children}</div>
                </SelectedElementContext.Provider>
              </EmailTemplateContext.Provider>
            </DragDropLayoutElement.Provider>
          </ScreenSizeContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </ConvexProvider>
  );
}

export default Provider;

export const useUserDetail = () => useContext(UserDetailContext);
export const useScreenSize = () => useContext(ScreenSizeContext);
export const useDragElementLayout = () => useContext(DragDropLayoutElement);
export const useEmailTemplate = () => useContext(EmailTemplateContext);
export const useSelectedElement = () => useContext(SelectedElementContext);
