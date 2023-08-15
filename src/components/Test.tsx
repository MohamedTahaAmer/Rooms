import { Avatar, AvatarFallback } from './ui/Avatar';
import Image from 'next/image';
import { Icons } from './Icons';
import { getAuthSession } from '@/lib/auth';

const Test = async () => {
  const session = await getAuthSession();
  return (
    <Avatar className='mt-4'>
      {session?.user.image ? (
        <Image
          fill
          sizes='100px'
          src={session?.user.image}
          alt='profile picture'
          referrerPolicy='no-referrer'
        />
      ) : (
        <AvatarFallback>
          <span className='sr-only'>{session?.user.name}</span>
          <div className='relative h-8 w-8 bg-gray-200'>
            <Icons.user className='absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2' />
          </div>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default Test;
