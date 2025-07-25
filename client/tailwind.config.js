import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // --- Additions for Animation ---
      animation: {
        // For the skeleton loader shimmer effect
        shimmer: "shimmer 2s linear infinite",
        // For the hero section's animated gradient background
        "gradient-x": "gradient-x 10s ease infinite",
      },
      keyframes: {
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(100%)" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      // --- End of Additions ---
    },
  },
  plugins: [typography, forms, aspectRatio],
};
