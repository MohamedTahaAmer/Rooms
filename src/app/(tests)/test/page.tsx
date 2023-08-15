import { getAuthSession } from '@/lib/auth';

const Page = async () => {
  const session = await getAuthSession();

  return (
    <section className='py-24'>
      <div className='container'>
        <h1 className='text-2xl font-bold'>Protected Server</h1>
        <div className='mx-auto w-fit text-2xl font-bold'>
          {session?.user?.name}
        </div>
      </div>
      <div className='test'></div>
      <p className='mt-8 w-fit rounded-xl bg-red-100 px-6 py-4'>
        this is just comp
      </p>
    </section>
  );
};

export default Page;
