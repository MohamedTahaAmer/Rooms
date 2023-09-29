import Link from 'next/link';
import { db } from '../../ztest';
import { buttonVariants } from './ui/Button';

const FeaturedRooms = async () => {
	const featuredRooms = await db.subreddit.findMany({
		where: {
			creatorId: null,
		},
	});
	console.log(featuredRooms);

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
};

export default FeaturedRooms;
