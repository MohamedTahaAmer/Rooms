'use client';

// this component just takes content form editor.js and displays it

import { FC } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// what does it mean, and what is the difference between it and normal import
const Output = dynamic(
	async () => (await import('editorjs-react-renderer')).default,
	{ ssr: false },
);

function CustomCodeRenderer({ data }: any) {
	data; // - just another stray variable

	return (
		<pre className='rounded-md bg-gray-800 p-4'>
			<code className='text-sm text-gray-100'>{data.code}</code>
		</pre>
	);
}

function CustomImageRenderer({ data }: any) {
	const src = data.file.url;

	return (
		<div className='relative min-h-[15rem] w-full'>
			<Image
				alt='image'
				className='object-contain'
				fill
				sizes='500pc'
				src={src}
			/>
		</div>
	);
}

const renderers = {
	image: CustomImageRenderer,
	code: CustomCodeRenderer,
};

const style = {
	paragraph: {
		fontSize: '0.875rem',
		lineHeight: '1.25rem',
	},
};

interface EditorOutputProps {
	// instead of getting the correct type of the content, by displaying it and infering it's type manually  he decieded to just give it a type of any
	content: any;
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
	return (
		// rendering this Output was givving him a ts error, but not any more, i think that's because i'm using the global ts now and not the local one, which is the same version as his TS
		<Output
			style={style}
			className='text-sm'
			renderers={renderers}
			// this Output from "editorjs-react-renderer" works well with all of the content types, but not the links and the images, so we provide custom renderes for those
			data={content}
		/>
	);
};

export default EditorOutput;
