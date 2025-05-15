// public/data/artworkManifest.js
// Contains metadata for the selected artworks for the TSATELIER gallery.
// - 12 pieces from the "Meridians" (2012) exhibition.
// - 2 "Meridian" pieces from the "Mutual" (2017) exhibition.
//
// NOTE:
// - `imageUrl` paths are updated to reflect your image files.
// - `dimensionsOriginal` (string like "24x36") has been added from CSV data.
// - `actualWidth` and `actualHeight` (pixel dimensions) are STILL PLACEHOLDERS.
//   You will need to update these with the correct pixel dimensions for each artwork.
// - `description` is a placeholder.

export const artworkManifest = {
  // --- From 2012 Meridians Exhibit ---
  "MERIDIANS_I": {
    id: "MERIDIANS_I",
    name: "MERIDIANS I",
    exhibition: "Meridians 2012",
    medium: "Acrylic on Canvas",
    dimensionsOriginal: "24x36", // From CSV
    imageUrl: "/images/MERIDIANS_I.jpg",
    actualWidth: 840,  // Example: User provided 840 for width
    actualHeight: 563, // Example: User provided 563 for height
    description: "Description for MERIDIANS I to be added."
  },
  "MERIDIANS_II": {
    id: "MERIDIANS_II",
    name: "MERIDIANS II",
    exhibition: "Meridians 2012",
    medium: "Acrylic on Canvas",
    dimensionsOriginal: "20x50", // From CSV
    imageUrl: "/images/MERIDIANS_II.jpg",
    actualWidth: 1270, // Placeholder: e.g., 50 inches wide
    actualHeight: 508,  // Placeholder: e.g., 20 inches high
    description: "Description for MERIDIANS II to be added."
  },
  "MERIDIANS_III": {
    id: "MERIDIANS_III",
    name: "MERIDIANS III",
    exhibition: "Meridians 2012",
    medium: "Acrylic, Graphite & Gold on Panel",
    dimensionsOriginal: "24x18", // From CSV
    imageUrl: "/images/MERIDIANS_III.jpg",
    actualWidth: 457,  // Placeholder: e.g., 18 inches wide
    actualHeight: 610, // Placeholder: e.g., 24 inches high
    description: "Description for MERIDIANS III to be added."
  },
  "MERIDIANS_IV": {
    id: "MERIDIANS_IV",
    name: "MERIDIANS IV",
    exhibition: "Meridians 2012",
    medium: "Acrylic, Graphite & Gold on Panel",
    dimensionsOriginal: "20x24", // From CSV
    imageUrl: "/images/MERIDIANS_IV.jpg",
    actualWidth: 508,  // Placeholder
    actualHeight: 610, // Placeholder
    description: "Description for MERIDIANS IV to be added."
  },
  "MERIDIANS_V": {
    id: "MERIDIANS_V",
    name: "MERIDIANS V",
    exhibition: "Meridians 2012",
    medium: "Acrylic, Graphite & Gold on Panel",
    dimensionsOriginal: "36x24", // From CSV
    imageUrl: "/images/MERIDIANS_V.jpg",
    actualWidth: 610,  // Placeholder: e.g., 24 inches wide
    actualHeight: 914, // Placeholder: e.g., 36 inches high
    description: "Description for MERIDIANS V to be added."
  },
  "MERIDIANS_VI": {
    id: "MERIDIANS_VI",
    name: "MERIDIANS VI",
    exhibition: "Meridians 2012",
    medium: "Acrylic on Panel",
    dimensionsOriginal: "24x24", // From CSV
    imageUrl: "/images/MERIDIANS_VI.jpg",
    actualWidth: 610,  // Placeholder
    actualHeight: 610, // Placeholder
    description: "Description for MERIDIANS VI to be added."
  },
  "MERIDIANS_VII": {
    id: "MERIDIANS_VII",
    name: "MERIDIANS VII",
    exhibition: "Meridians 2012",
    medium: "Acrylic on Canvas",
    dimensionsOriginal: "24x24", // From CSV
    imageUrl: "/images/MERIDIANS_VII.jpg",
    actualWidth: 610,  // Placeholder
    actualHeight: 610, // Placeholder
    description: "Description for MERIDIANS VII to be added."
  },
  "MERIDIANS_VIII": {
    id: "MERIDIANS_VIII",
    name: "MERIDIANS VIII",
    exhibition: "Meridians 2012",
    medium: "Acrylic on Canvas",
    dimensionsOriginal: "36x30", // From CSV
    imageUrl: "/images/MERIDIANS_VIII.jpg",
    actualWidth: 762,  // Placeholder: e.g., 30 inches wide
    actualHeight: 914, // Placeholder: e.g., 36 inches high
    description: "Description for MERIDIANS VIII to be added."
  },
  "MERIDIANS_IX": {
    id: "MERIDIANS_IX",
    name: "MERIDIANS IX",
    exhibition: "Meridians 2012",
    medium: "Acrylic on panel",
    dimensionsOriginal: "36x30", // From CSV
    imageUrl: "/images/MERIDIANS_IX.jpg", // You had this as MERIDIANS_IX.jpg
    actualWidth: 762,  // Placeholder
    actualHeight: 914, // Placeholder
    description: "Description for MERIDIANS IX to be added."
  },
  "MERIDIANS_XI": { // MERIDIANS X is not in the 2012 CSV, XI is.
    id: "MERIDIANS_XI",
    name: "MERIDIANS XI",
    exhibition: "Meridians 2012",
    medium: "Acrylic & Graphite on Panel",
    dimensionsOriginal: "36x36", // From CSV
    imageUrl: "/images/MERIDIANS_XI.jpg",
    actualWidth: 914,  // Placeholder
    actualHeight: 914, // Placeholder
    description: "Description for MERIDIANS XI to be added."
  },
  "MERIDIANS_XII": {
    id: "MERIDIANS_XII",
    name: "MERIDIANS XII",
    exhibition: "Meridians 2012",
    medium: "Acrylic on Canvas over Panel",
    dimensionsOriginal: "32x68", // From CSV
    imageUrl: "/images/MERIDIANS_XII.jpg",
    actualWidth: 1727, // Placeholder: e.g., 68 inches wide
    actualHeight: 813,  // Placeholder: e.g., 32 inches high
    description: "Description for MERIDIANS XII to be added."
  },
  "MERIDIANS_STUDY_II": {
    id: "MERIDIANS_STUDY_II",
    name: "MERIDIANS Study II",
    exhibition: "Meridians 2012",
    medium: "Acrylic, Graphite & Gold on Panel",
    dimensionsOriginal: "30x30", // From CSV
    imageUrl: "/images/MERIDIANS_STUDY_II.jpg",
    actualWidth: 762,  // Placeholder
    actualHeight: 762, // Placeholder
    description: "Description for MERIDIANS Study II to be added."
  },

  // --- From 2017 Mutual Exhibit ---
  "MERIDIANS_XIII_MUTUAL": {
    id: "MERIDIANS_XIII_MUTUAL",
    name: "MERIDIANS XIII",
    exhibition: "Mutual 2017",
    medium: "Unknown/Not specified in Mutual CSV", // CSV for Mutual doesn't list medium per piece
    dimensionsOriginal: "34x36", // From CSV
    imageUrl: "/images/MERIDIANS_XIII_MUTUAL.jpg",
    actualWidth: 864,  // Placeholder: e.g., 34 inches wide
    actualHeight: 914, // Placeholder: e.g., 36 inches high
    description: "Description for MERIDIANS XIII (Mutual) to be added."
  },
  "MERIDIANS_XIV_MUTUAL": {
    id: "MERIDIANS_XIV_MUTUAL",
    name: "MERIDIANS XIV",
    exhibition: "Mutual 2017",
    medium: "Unknown/Not specified in Mutual CSV",
    dimensionsOriginal: "40x40", // From CSV
    imageUrl: "/images/MERIDIANS_XIV_MUTUAL.jpg",
    actualWidth: 1016, // Placeholder
    actualHeight: 1016, // Placeholder
    description: "Description for MERIDIANS XIV (Mutual) to be added."
  }
};

console.log('[artworkManifest.js] Artwork manifest updated with image URLs and original dimensions.');
