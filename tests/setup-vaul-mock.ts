import { vi } from "vitest";
import React from "react";

// Mock vaul Drawer for jsdom unit tests.
// vaul's drag/transform logic requires real browser APIs (getComputedStyle,
// setPointerCapture) that jsdom does not support, causing uncaught TypeErrors.
vi.mock("vaul", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type P = any;

  const Root = ({ children, open }: P) => {
    if (!open) return null;
    return React.createElement("div", { "data-vaul-drawer": "" }, children);
  };

  const Portal = ({ children }: P) => children;

  const Overlay = React.forwardRef<HTMLDivElement, P>(
    (props, ref) => React.createElement("div", { ...props, ref, "data-vaul-overlay": "" })
  );

  const Content = React.forwardRef<HTMLDivElement, P>(
    ({ children, ...props }, ref) =>
      React.createElement("div", { ...props, ref, role: "dialog", "data-vaul-content": "" }, children)
  );

  const Title = React.forwardRef<HTMLHeadingElement, P>(
    ({ children, ...props }, ref) => React.createElement("h2", { ...props, ref }, children)
  );

  const Description = React.forwardRef<HTMLParagraphElement, P>(
    ({ children, ...props }, ref) => React.createElement("p", { ...props, ref }, children)
  );

  const Close = React.forwardRef<HTMLButtonElement, P>(
    ({ children, ...props }, ref) => React.createElement("button", { ...props, ref }, children)
  );

  const Trigger = React.forwardRef<HTMLButtonElement, P>(
    ({ children, ...props }, ref) => React.createElement("button", { ...props, ref }, children)
  );

  return {
    Drawer: Object.assign(Root, {
      Root, Portal, Overlay, Content, Title, Description, Close, Trigger,
    }),
  };
});
