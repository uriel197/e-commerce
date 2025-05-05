import {
  Fa500Px,
  FaAccusoft,
  FaAdversal,
  FaAvianex,
  FaBitcoin,
  FaBtc,
  FaCodiepie,
  FaDocker,
  FaGithubSquare,
} from "react-icons/fa";
import { nanoid } from "nanoid";

export const adminSublinks = [
  {
    page: "Main",
    pageId: nanoid(),
    links: [
      {
        id: nanoid(),
        label: "Home",
        url: "/",
      },
      {
        id: nanoid(),
        label: "About",
        url: "/about",
      },
    ],
  },
  {
    pageId: nanoid(),
    page: "View products",
    links: [
      {
        id: nanoid(),
        label: "products",
        url: "/products",
      },
      {
        id: nanoid(),
        label: "create product",
        url: "/createProduct",
      },
      {
        id: nanoid(),
        label: "update product",
        url: "/updateProduct",
      },
      {
        id: nanoid(),
        label: "delete product",
        url: "/deleteProduct",
      },
      {
        id: nanoid(),
        label: "Puppeteer",
        url: "/puppeteer",
      },
    ],
  },
  {
    pageId: nanoid(),
    page: "view order",
    links: [
      {
        id: nanoid(),
        label: "Cart",
        url: "/cart",
      },
      {
        id: nanoid(),
        label: "Checkout",
        url: "/checkout",
      },
      {
        id: nanoid(),
        label: "Orders",
        url: "/orders",
      },
    ],
  },
];

export const sublinks = [
  {
    page: "Main",
    pageId: nanoid(),
    links: [
      {
        id: nanoid(),
        label: "Home",
        url: "/",
      },
      {
        id: nanoid(),
        label: "About",
        url: "/about",
      },
    ],
  },
  {
    pageId: nanoid(),
    page: "View products",
    links: [
      {
        id: nanoid(),
        label: "products",
        url: "/products",
      },
      {
        id: nanoid(),
        label: "Puppeteer",
        url: "/puppeteer",
      },
    ],
  },
  {
    pageId: nanoid(),
    page: "view order",
    links: [
      {
        id: nanoid(),
        label: "Cart",
        url: "/cart",
      },
      {
        id: nanoid(),
        label: "Checkout",
        url: "/checkout",
      },
    ],
  },
];
