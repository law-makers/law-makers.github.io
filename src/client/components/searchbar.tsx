import {useState, type ChangeEvent} from 'react';

type SearchBarProps = {
    readonly onSearchChange: (value: string) => void;
};

export default function SearchBar({onSearchChange}: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setSearchQuery(value);
        onSearchChange(value);
    };

    return (
	<div className='flex justify-center items-center p-4 pt-0 md:pt-8'>
		<input
			type="text"
			placeholder="Search..."
			value={searchQuery}
			className="bg-transparent border-2 border-black rounded-lg shadow-lg hover:shadow-xl dark:border-white text-black dark:text-white placeholder-black dark:placeholder-white p-2 outline-none"
			onChange={handleSearchChange}
            />
	</div>
    );
}
