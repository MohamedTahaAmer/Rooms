'use client';
import { usePathname } from 'next/navigation';
import SearchSubreddits from './SearchSubreddits';
import SearchPosts from './SearchPosts';

const SearchBar = () => {
	const pathname = usePathname();
	if (pathname.includes('r')) return <SearchPosts />;
	return <SearchSubreddits />;
};

export default SearchBar;
