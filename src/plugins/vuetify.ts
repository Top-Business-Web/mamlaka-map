import "vuetify/styles";
import { createVuetify, type ThemeDefinition } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";

const customeTheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: "red",
    secondary: "#424242",
    accent: "#82B1FF",
    error: "#FF5252",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FFC107",
    lightblue: "#14c6FF",
    yellow: "#FFCF00",
    pink: "#FF1976",
    orange: "#FF8657",
    magenta: "#C33AFC",
    darkblue: "#1E2D56",
    gray: "#909090",
    neutralgray: "#9BA6C1",
    green: "#2ED47A",
    red: "#FF5c4E",
    darkblueshade: "#308DC2",
    lightgray: "#BDBDBD",
    lightpink: "#FFCFE3",
    white: "#FFFFFF",
    muted: "#6c757d"
  }
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#B49164",
          secondary: "#A8AAAE",
          success: "#28C76F",
          info: "#00CFE8",
          warning: "#FF9F43",
          error: "#EA5455",
          background: "#F8F7FA"
        },
        variables: {
          "border-color": "#4B465C"
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: "#E7C394",
          accent: "#2C2D2F",
          gray: "#959595",
          secondary: "#6F7277",
          success: "#28C76F",
          info: "#00CFE8",
          warning: "#FF9F43",
          error: "#EA5455",
          background: "#1B1D21",
          surface: "#1A1A1A" // #2C2D2F
        },
        variables: {
          "border-color": "#CFD3EC",
          "medium-emphasis-opacity": 0.68,

          // Shadows
          "shadow-key-umbra-opacity": "rgba(12, 16, 27, 0.15)",
          "shadow-key-penumbra-opacity": "rgba(12, 16, 27, 0.01)",
          "shadow-key-ambient-opacity": "rgba(12, 16, 27, 0.08)"
        }
      }
    }
  },
  locale: {
    // adapter: createVueI18nAdapter({ i18n, useI18n })
  }
});

export default vuetify;
