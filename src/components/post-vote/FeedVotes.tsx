'use client';

import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { cn } from '@/lib/utils';
import { PostVoteRequest } from '@/lib/validators/vote';
import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from '../../hooks/use-toast';
import { Button } from '../ui/Button';

interface FeedVotesProps {
	postId: string;
	initialVotesAmt: number;
	initialVote?: VoteType | null;
}

const FeedVotes = ({
	postId,
	initialVotesAmt,
	initialVote,
}: FeedVotesProps) => {
	const { loginToast } = useCustomToasts();
	const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
	const [currentVote, setCurrentVote] = useState(initialVote);
	const prevVote = usePrevious(currentVote);

	useEffect(() => {
		setCurrentVote(initialVote);
	}, [initialVote]);

	const { mutate: vote } = useMutation({
		mutationFn: async (type: VoteType) => {
			const payload: PostVoteRequest = {
				voteType: type,
				postId: postId,
			};

			await axios.patch('/api/subreddit/post/vote', payload);
		},
		onError: (err, voteType) => {
			if (voteType === 'UP') setVotesAmt((prev) => prev - 1);
			else setVotesAmt((prev) => prev + 1);

			// reset current vote
			setCurrentVote(prevVote);

			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: 'Something went wrong.',
				description: 'Your vote was not registered. Please try again.',
				variant: 'destructive',
			});
		},
		onMutate: (type: VoteType) => {
			if (currentVote === type) {
				// User is voting the same way again, so remove their vote
				setCurrentVote(undefined);
				if (type === 'UP') setVotesAmt((prev) => prev - 1);
				else if (type === 'DOWN') setVotesAmt((prev) => prev + 1);
			} else {
				// User is voting in the opposite direction, so subtract 2
				setCurrentVote(type);
				if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
				else if (type === 'DOWN')
					setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
			}
		},
	});

	return (
		<div className=' flex  gap-4 max-md:absolute max-md:bottom-2 max-md:right-3 md:w-[75px] md:flex-col md:gap-0 md:pb-0 md:pr-6'>
			{/* upvote */}
			<Button
				onClick={() => vote('UP')}
				size='sm'
				variant='ghost'
				aria-label='upvote'
			>
				<ArrowBigUp
					className={cn('h-5 w-5 text-foreground', {
						'fill-emerald-500 text-emerald-500': currentVote === 'UP',
					})}
				/>
			</Button>

			{/* score */}
			<p className='py-2 text-center text-sm font-medium text-foreground'>
				{votesAmt}
			</p>

			{/* downvote */}
			<Button
				onClick={() => vote('DOWN')}
				size='sm'
				className={cn({
					'text-emerald-500': currentVote === 'DOWN',
				})}
				variant='ghost'
				aria-label='downvote'
			>
				<ArrowBigDown
					className={cn('h-5 w-5 text-foreground', {
						'fill-red-500 text-red-500': currentVote === 'DOWN',
					})}
				/>
			</Button>
		</div>
	);
};

export default FeedVotes;
