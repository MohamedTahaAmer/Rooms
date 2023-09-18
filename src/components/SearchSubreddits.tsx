'use client';

import { type Subreddit } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/Command';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { Users } from 'lucide-react';
import Link from 'next/link';

interface SearchSubredditsProps {}

const SearchSubreddits: FC<SearchSubredditsProps> = ({}) => {
	const [input, setInput] = useState<string>('');
	const pathname = usePathname();
	const commandRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useOnClickOutside(commandRef, () => {
		setInput('');
	});

	const request = debounce(async () => {
		refetch();
	}, 300);

	const debounceRequest = useCallback(() => {
		request();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		isFetching,
		data: queryResults,
		refetch,
		isFetched,
	} = useQuery({
		queryFn: async () => {
			if (!input) return [];
			const { data } = await axios.get(`/api/search?q=${input}`);
			return data as Subreddit[];
		},
		queryKey: ['search-posts'],
		enabled: false,
	});

	useEffect(() => {
		setInput('');
	}, [pathname]);

	return (
		<Command
			ref={commandRef}
			className='relative z-50 max-w-lg overflow-visible rounded-lg border'
		>
			<CommandInput
				isLoading={isFetching}
				onValueChange={(text) => {
					setInput(text);
					debounceRequest();
				}}
				value={input}
				className='border-none outline-none ring-0 focus:border-none focus:outline-none'
				placeholder='Search communities...'
			/>

			{input.length > 0 && (
				<CommandList className='shadoww absolute inset-x-0 top-full rounded-b-md bg-background'>
					{isFetched && <CommandEmpty>No results found.</CommandEmpty>}
					{(queryResults?.length ?? 0) > 0 ? (
						<CommandGroup heading='Communities'>
							{queryResults?.map((subreddit) => (
								<CommandItem
									onSelect={(e) => {
										router.push(`/r/${e}`);
										router.refresh();
									}}
									key={subreddit.id}
									value={subreddit.name}
								>
									<Users className='mr-2 h-4 w-4' />
									<Link href={`/r/${subreddit.name}`}>r/{subreddit.name}</Link>
								</CommandItem>
							))}
						</CommandGroup>
					) : null}
				</CommandList>
			)}
		</Command>
	);
};

export default SearchSubreddits;
