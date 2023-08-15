'use client';

import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { PostVoteRequest } from '@/lib/validators/vote';
import { usePrevious } from '@mantine/hooks';
import type { VoteType } from '@prisma/client'; // >(6:05) prisma creates TS types for us
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from '../../hooks/use-toast';
import { Button } from '../ui/Button';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostVoteClientProps {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
  classNames?: string;
}

// >(5:55)
const PostVoteClient = ({
  postId,
  initialVotesAmt,
  initialVote,
  classNames,
}: PostVoteClientProps) => {
  const { loginToast } = useCustomToasts();
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);
  // >(5:56) i don't know what this usePrevious does yet, but he is saying we can use ref instead
  // it will be used to give us the ability to recover from an obtimistic update, if the api request wasn't a success
  // note that there is no thing such as setPrevVote() as the prevVote get's it's value automatically from the currentVote

  // >(5:56) ensure sync with server
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
      // this patch is because we are using the same api endpoint to create the post, then toggle or remove it.
    },
    onError: (err, type) => {
      // in here we get the err object first then we get the the argument that we passed to the mutationFn
      if (type === 'UP') setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setCurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          // if you used err.message then you will get the message that's assigned automatically by Next.Response() to the all the responses with 401 state
          return loginToast(err.response.data.message);
        }
        return toast({
          title: err.response?.data.message,
          description: 'Your vote was not registered. Please try again.',
          variant: 'destructive',
        });
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your vote was not registered. Please try again.',
        variant: 'destructive',
      });
    },

    // >(6:38) optimistic update
    // note that we are using onMutate not onSuccess as we used to
    // this on mutate runs directley after calling the mutationFn, it doesn't wait till the mutationFn returns like onSuccess() does
    onMutate: (type: VoteType) => {
      // this type is the same argument you pass to the mutationFn when calling it
      console.log(currentVote);
      console.log(type);

      // User is voting the same way again,, so remove their vote
      if (currentVote === type) {
        console.log('in');
        console.log(currentVote);
        console.log(votesAmt);
        // then first make he current vote to undefined,
        setCurrentVote(undefined);
        if (type === 'UP') setVotesAmt((prev) => prev - 1);
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1);
      } else {
        setCurrentVote(type);
        // id there was a currentVote then the User is voting in the opposite direction, so subtract 2
        // if the currentVote was undefined, then then the user is voting for the first time
        // note that we can safly access the old value of "currentVote" after useing "setCurrentVote" as react state update takes place after the sync code then the async like promises finishes, then react will update the state
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === 'DOWN')
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className={cn('', classNames)}>
      <div className='mx-auto flex w-fit items-center gap-4 md:flex-col md:gap-1  '>
        {/* upvote */}
        <Button
          // >(6:32)
          onClick={() => vote('UP')}
          size='sm'
          variant='ghost'
          // aria labes are added to things that doesn't have text inside, like the icons and the images
          aria-label='upvote'
          className='w-fit'
        >
          <ArrowBigUp
            className={cn('h-5  text-zinc-700', {
              // >(5:59) here is another easier way of diplaying conditional styles, and i think this way is easier than using a ref
              // and this is done by the clsx npx package to make it easier to display styles conditionlay
              'fill-emerald-500 text-emerald-500': currentVote === 'UP',
            })}
          />
        </Button>

        {/* score */}
        <p className=' w-fit text-center text-sm font-medium text-zinc-900'>
          {votesAmt}
        </p>

        {/* downvote */}
        <Button
          onClick={() => vote('DOWN')}
          size='sm'
          variant='ghost'
          className='w-fit'
          aria-label='upvote'
        >
          <ArrowBigDown
            className={cn('h-5  text-zinc-700', {
              'fill-red-500 text-red-500': currentVote === 'DOWN',
            })}
          />
        </Button>
      </div>
    </div>
  );
};

export default PostVoteClient;
