import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    // Mobile-First: 기본 뷰포트를 모바일로 설정
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "375px", height: "667px" },
        },
        mobileLarge: {
          name: "Mobile Large",
          styles: { width: "414px", height: "896px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1280px", height: "800px" },
        },
      },
      defaultViewport: "mobile",
    },
  },
};

export default preview;
