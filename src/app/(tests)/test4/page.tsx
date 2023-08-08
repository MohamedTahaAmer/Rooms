interface PageProps {
  searchParams: { [key: string]: string };
}

const Page = ({ searchParams }: PageProps) => {
  return <div>page : {searchParams?.id || ""}</div>;
};

export default Page;

// "use client";

// import { useEffect, useRef } from "react";

// const Page = () => {
//   const myRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//       // This will result in the read-only error
//       myRef.current = document.getElementById("someElement");
//   }, []);

//   return <div ref={myRef}>Hello World</div>;
// };

// export default Page;
