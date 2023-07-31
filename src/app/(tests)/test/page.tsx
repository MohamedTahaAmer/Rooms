import Test from "@/components/Test";
import { getAuthSession } from "@/lib/auth";

const Page = async () => {
  const session = await getAuthSession();

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-2xl font-bold">Protected Server</h1>
        <div className="mx-auto w-fit text-2xl font-bold">
          {session?.user?.name}
        </div>
      </div>
      <div className="test">
        <Test
          user={{ image: session?.user?.image!, name: session?.user?.name! }}
        />
      </div>
    </section>
  );
};

export default Page;
