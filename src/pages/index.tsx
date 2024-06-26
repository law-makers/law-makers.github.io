// Pages/index.tsx
import {useState} from 'react';
import {type PageConfig} from 'next';
import Link from 'next/link';
import type {ReactNode} from 'react';
import {posts, sortPosts} from '../posts';
import Navbar from '../client/components/navbar';
import SearchBar from '../client/components/searchbar';

export const config: PageConfig = {
	unstable_runtimeJS: false,
};

export default function Home() {
	const [searchQuery, setSearchQuery] = useState('');

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
	};

	const filteredPosts = sortPosts(posts).filter(post => (
			!post.hidden &&
			post.name.toLowerCase().includes(searchQuery.toLowerCase())
		));

	return (
		<main className="md:space-y-4 max-w-prose mx-auto px-2 md:px-0">
			<Navbar />
			<SearchBar onSearchChange={handleSearchChange} /> {/* Use the SearchBar component */}
			<div className='custom-card p-4'>
				<h2>
					<span>zulfikar/blog</span>{' - '}
					<a
						target="_blank"
						href="https://github.com/muhammad-zulfikar/blog"
						className="text-neutral-500 hover:underline"
						rel="noreferrer"
					>
						github
					</a>
				</h2>

				<ul className="space-y-1 list-disc list-inside mt-4">
					{filteredPosts.map(post => (
						<BlogLink key={post.slug} href={`/${post.slug}`}>
							{post.name}
						</BlogLink>
					))}
				</ul>
			</div>
			<footer className="mx-auto flex max-w-3xl items-center justify-center px-6 pb-12 text-sm text-neutral-600 dark:text-gray-400 [&_a:hover]:underline [&_a]:p-4 [&_a]:transition-colors">
				<Link href="https://muhammad-zulfikar.github.io">Home</Link>
				<Link href="https://muhammad-zulfikar.github.io/stats">Stats</Link>
				<Link href="https://github.com/muhammad-zulfikar/blog" target='_blank'>Source</Link>
			</footer>
		</main>
	);
}

function BlogLink(props: {readonly href: string; readonly children: ReactNode}) {
	return (
		<li>
			<Link
				className="hover:underline dark:text-white"
				href={props.href}
			>
				{props.children}
			</Link>
		</li>
	);
}
