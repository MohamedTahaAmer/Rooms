'use client';
import { Button } from '@/components/ui/Button';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { useToast } from '../hooks/use-toast';
import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { Loader2 } from 'lucide-react';

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean;
  subredditId: string;
  subredditName: string;
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subredditName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast();
  const { loginToast } = useCustomToasts();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data }: { data: { subredditId: string } } = await axios.post(
        '/api/subreddit/subscribe',
        payload
      );
      return data.subredditId;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          loginToast(err.response.data.message);
          return;
        }
      }

      toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: 'Subscribed!',
        description: `You are now subscribed to r/${subredditName}`,
        duration: 2000,
        variant: 'success',
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data }: { data: { subredditId: string } } = await axios.post(
        '/api/subreddit/unsubscribe',
        payload
      );
      return data.subredditId;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        // - here we are too lazy to handle all the axios erros, unlike in the create subreddit page.
        if (err.response?.status === 401) {
          loginToast(err.response.data.message);
          return;
        }
      }

      toast({
        title: 'Error',
        description: 'Some Thing went wrong, Please try again.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: 'Unsubscribed!',
        description: `You are now unSubscribed from/${subredditName}`,
        duration: 2000,
        variant: 'success',
      });
    },
  });

  return isSubscribed ? (
    <div
      className='py-3 text-gray-500 underline decoration-black underline-offset-2 hover:cursor-pointer'
      onClick={() => unsubscribe()}
    >
      {isUnSubLoading ? (
        <Loader2 className='inline animate-spin ' />
      ) : (
        'Leave community'
      )}
    </div>
  ) : (
    <div>
      <Button
        className='mb-6 mt-4 w-full hover:cursor-pointer'
        isLoading={isSubLoading}
        onClick={() => subscribe()}
      >
        Join to post
      </Button>
    </div>
  );
};

export default SubscribeLeaveToggle;
