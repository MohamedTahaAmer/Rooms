interface PageProps {
  searchParams: { [key: string]: string };
}

const Page = ({ searchParams }: PageProps) => {
  return <div>page : {searchParams?.id || ""}</div>;
};

export default Page;
