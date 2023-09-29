import Link from 'next/link';
import { buttonVariants } from './ui/Button';
import { db } from '@/lib/db';

const FeaturedRooms = async () => {
	try {
		const featuredRooms = await db.subreddit.findMany({
			where: {
				creatorId: null,
			},
		});
		return (
			// <div className='grid grid-cols-3 gap-2 p-4 '>
			<div className='flex flex-wrap  gap-2 p-4 '>
				{featuredRooms.map((room) => (
					<Link
						key={room.id}
						className={buttonVariants()}
						href={`/r/${room.name}`}
					>
						{room.name}
					</Link>
				))}
			</div>
		);
	} catch (error) {
		console.log(error);
	}
};

export default FeaturedRooms;
