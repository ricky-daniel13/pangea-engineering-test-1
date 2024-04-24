export const drawerWidth = "14.5rem"; // Assuming your Navbar width is 240px

export const promotionTypeOptions = {
  TikTok: ["Sound", "Brand", "Livestream"],
  Instagram: ["Sound", "Brand", "Story Set"],
  Youtube: ["30 Second Integration", "60 Second Integration"],
};

export const platformToColumnsMap = {
  TikTok: [2], // Column 3 in human-readable form
  Instagram: [3], // Column 4 in human-readable form
  Youtube: [4], // Column 5 in human-readable form
};

export const platformIndexMap = {
  TikTok: 2, // Column 3 in human-readable form, index 2 in zero-based indexing
  Instagram: 3, // Column 4 in human-readable form, index 3 in zero-based indexing
  Youtube: 4, // Column 5 in human-readable form, index 4 in zero-based indexing
};

export const priceColumnMap = {
  TikTok: {
    Sound: 8, // Column index for TikTok Sound price
    Brand: 9, // Column index for TikTok Brand price
  },
  Instagram: {
    Sound: 11, // Column index for Instagram Sound price
    Brand: 12, // Column index for Instagram Brand price
  },
};
export const platFormLink = {
  TikTok: 2, // Column 3 in human-readable form, index 2 in zero-based indexing
  Instagram: 3, // Column 4 in human-readable form, index 3 in zero-based indexing
  Youtube: 4, // Column 5 in human-readable form, index 4 in zero-based indexing
};

export const paymentTerms = [
  { name: "Net 5", id: "1" },
  { name: "Net 30", id: "2" },
  { name: "Net 45", id: "3" },
  { name: "Net 60", id: "4" },
];

export const defaultFriends = [
  // ... friends data ...
  {
    name: "Friend One",
    avatar: "https://via.placeholder.com/150",
  },
  {
    name: "Friend Two",
    avatar: "https://via.placeholder.com/150",
  },
  {
    name: "Friend 2",
    avatar: "https://via.placeholder.com/150",
  },
  {
    name: "Friend 3",
    avatar: "https://via.placeholder.com/150",
  },
];

export const defaultTweets = [
  // ... tweets data ...
  {
    user: {
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
    },
    time: "2023-07-21",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis.",
  },
  {
    user: {
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
    },
    time: "2023-07-21",
    content:
      "Curabitur non ipsum id dolor ullamcorper elementum. Sed in massa metus.",
  },
  {
    user: {
      name: "Jane Doe",
      avatar: "https://via.placeholder.com/150",
    },
    time: "2023-07-21",
    content:
      "Curabitur non ipsum id dolor ullamcorper elementum. Sed in massa metus.",
  },
];
