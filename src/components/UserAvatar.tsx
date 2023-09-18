'use client';
import { User } from '@prisma/client';
import { AvatarProps } from '@radix-ui/react-avatar';

import { Icons } from '@/components/Icons';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { getAuthedUser } from '@/lib/actions/actions.user';
import Image from 'next/image';
import { useEffect, useState } from 'react';

let getUserImg = (image: string | null, name: string | null) => {
	return (
		<>
			{image ? (
				<div className='relative aspect-square h-full w-full'>
					<Image
						fill
						src={image}
						alt='profile picture'
						referrerPolicy='no-referrer'
					/>
				</div>
			) : (
				<AvatarFallback>
					<span className='sr-only'>{name}</span>
					<Icons.user className='h-4 w-4' />
				</AvatarFallback>
			)}
		</>
	);
};

interface UserAvatarProps extends AvatarProps {
	user?: Pick<User, 'image' | 'name'>;
}

// - this UserAvatar component now has the ability to use the 'name,image' if passed, and if not passed, it will make a request to a server action to get the 'name,image' of the currently Authed user
export function UserAvatar({ user, ...props }: UserAvatarProps) {
	const [name, setName] = useState<string | null>(user?.name || null);
	const [image, setImage] = useState<string | null>(user?.image || null);

	useEffect(() => {
		const fetchData = async () => {
			const dbUser = await getAuthedUser();
			setName(dbUser?.name || '');
			setImage(dbUser?.image || '');
		};
		if (!user) fetchData();
	}, [user]);
	return <Avatar {...props}>{getUserImg(image, name)}</Avatar>;
}

// - you can't call a server action on component render, sp we call it inside a useEffect
// - useEffect  function can't be an async, so we use an async inside of it
/*
- error Error: Server Functions cannot be called during initial 
render. This would create a fetch waterfall. Try to use a Server Component to pass data to Client Components instead.
    at UserAvatar (./src/components/UserAvatar.tsx:68:102) 
*/

// - client components can't be async ones, although you can create async functions inside of them
// https://nextjs.org/docs/messages/no-async-client-component
