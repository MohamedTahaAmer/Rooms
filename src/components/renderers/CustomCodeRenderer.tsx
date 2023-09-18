'use client';

function CustomCodeRenderer({ data }: any) {
	data;

	return (
		<pre className='rounded-md bg-foreground p-4'>
			<code className='text-sm text-background'>{data.code}</code>
		</pre>
	);
}

export default CustomCodeRenderer;
