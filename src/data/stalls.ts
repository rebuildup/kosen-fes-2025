import { Stall } from "../types/common";

export const stalls: Stall[] = [
  {
    id: "stall-1",
    type: "stall",
    title: "International Food Stall",
    description:
      "Enjoy delicious dishes from around the world prepared by international students.",
    imageUrl: "./images/stalls/stall-1.jpg",
    date: "2025-06-15",
    time: "11:00 - 20:00",
    location: "学生会館, Food Court",
    tags: ["food", "international"],
    products: ["Curry Rice", "Pad Thai", "Tacos", "Pasta"],
  },
  {
    id: "stall-2",
    type: "stall",
    title: "Takoyaki Stand",
    description:
      "Traditional Japanese takoyaki prepared freshly by the Japanese Cultural Club.",
    imageUrl: "./images/stalls/stall-2.jpg",
    date: "2025-06-15",
    time: "11:00 - 20:00",
    location: "学生会館, Food Court",
    tags: ["food", "japanese"],
    products: ["Original Takoyaki", "Cheese Takoyaki", "Spicy Takoyaki"],
  },
  {
    id: "stall-3",
    type: "stall",
    title: "Tech Gadgets Bazaar",
    description:
      "Buy innovative gadgets and tech creations made by engineering students.",
    imageUrl: "./images/stalls/stall-3.jpg",
    date: "2025-06-15",
    time: "10:00 - 18:00",
    location: "研究室棟A, Exhibition Area",
    tags: ["technology", "gadgets", "sales"],
    products: ["LED Lamps", "USB Gadgets", "Phone Accessories", "Arduino Kits"],
  },
  {
    id: "stall-4",
    type: "stall",
    title: "Crafts & Handmade Items",
    description:
      "Handmade crafts, accessories, and art pieces made by arts club students.",
    imageUrl: "./images/stalls/stall-4.jpg",
    date: "2025-06-16",
    time: "10:00 - 18:00",
    location: "第2校舎, Art Room",
    tags: ["crafts", "handmade", "art", "sales"],
    products: ["Keychains", "Bookmarks", "Postcards", "Handmade Jewelry"],
  },
  {
    id: "stall-5",
    type: "stall",
    title: "Bubble Tea Shop",
    description:
      "Refreshing bubble tea in various flavors, perfect for a hot festival day.",
    imageUrl: "./images/stalls/stall-5.jpg",
    date: "2025-06-16",
    time: "11:00 - 20:00",
    location: "学生会館, Cafe Area",
    tags: ["drinks", "bubble tea"],
    products: [
      "Classic Milk Tea",
      "Fruit Tea",
      "Brown Sugar Milk Tea",
      "Matcha Latte",
    ],
  },
  {
    id: "stall-6",
    type: "stall",
    title: "Festival Merchandise",
    description:
      "Official Ube Kosen Festival 2025 merchandise including t-shirts, bags, and souvenirs.",
    imageUrl: "./images/stalls/stall-6.jpg",
    date: "2025-06-16",
    time: "10:00 - 21:00",
    location: "管理棟, Reception",
    tags: ["merchandise", "souvenirs", "sales"],
    products: ["T-shirts", "Tote Bags", "Stickers", "Pins", "Posters"],
  },
];
