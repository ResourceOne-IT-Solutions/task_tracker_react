export const data = [
  {
    name: "Naresh",
    phone: "9010586402",
    email: "naresh@gmail.com",
    image: "image.jpg",
    technology: "React JS",
    onClick: (e: any) => console.log(e, "onClick of Naresh"),
  },
  {
    name: "Vinay",
    phone: "9866265550",
    email: "vinay@gmail.com",
    image: "image.jpg",
    technology: "Vue JS",
  },
  {
    name: "Brahma",
    phone: "6304587451",
    email: "brahma@gmail.com",
    image: "image.jpg",
    technology: "React JS",
  },
  {
    name: "Tharun",
    phone: "9353456851",
    email: "tharun@gmail.com",
    image: "image.jpg",
    technology: "Angular",
  },
  {
    name: "Mahesh",
    phone: "8545789645",
    email: "mahesh@gmail.com",
    image: "image.jpg",
    technology: "Angular JS",
  },
];

export const headersData = [
  {
    title: "Name",
    key: "name",
    node: "select",
    values: ["sun", "mon", "tue"],
    onClick: (e: any) => console.log(e.target.value),
  },
  {
    title: "phone",
    onClick: () => console.log("Mobile no SORT"),
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
    node: "select",
    values: [
      { key: "One", value: 1 },
      { key: "Two", value: 2 },
      { key: "Three", value: 3 },
    ],
    onClick: (e: any) => console.log(e.target.value),
  },
  { title: "Password", key: "password" },
  { title: "image", key: "image", render: <img src="#" alt="image" /> },
  {
    title: "Technology",
    onClick: () => console.log("Technology SORT"),
    key: "technology",
  },
];
export const defaultTdFormat = [
  {
    key: "email",
    format: (val: any) => <a href={`mailto:${val.email}`}>{val.email}</a>,
  },
];
