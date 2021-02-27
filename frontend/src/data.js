const NAV_LINKS = [
  {
    title: "shop",
    to: "/",
    admin: false,
    alternative: undefined,
  },
  {
    title: "products",
    to: "/products",
    admin: false,
    alternative: undefined,
  },
  {
    title: "admin products",
    to: "/admin/products",
    admin: true,
    alternative: "/admin/edit-product/",
  },
  {
    title: "add product",
    to: "/admin/add-product",
    admin: true,
    alternative: undefined,
  },
];

export default NAV_LINKS;
