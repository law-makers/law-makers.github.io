import {useState, useRef, useEffect} from 'react';
import {FiMenu, FiSun, FiMoon} from 'react-icons/fi';
import {useTheme} from 'next-themes';
import Link from 'next/link';

function useClickOutside(ref: React.RefObject<HTMLDivElement>, buttonRef: React.RefObject<HTMLButtonElement>, onClickOutside: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node) && buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, buttonRef, onClickOutside]);
}

export default function Navbar() {
    const {theme, setTheme} = useTheme();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    useClickOutside(navRef, buttonRef, () => {
 setIsNavOpen(false);
});

    return (
	<div className="fixed top-0 left-0 right-0 z-50">
		<div className="flex justify-between items-center p-4 bg-transparent">
			<button
				ref={buttonRef}
				type='button'
				className="px-4 py-2 ml-2 md:mt-6 md:ml-6 rounded-lg custom-card"
				onClick={toggleNav}
			>
				<FiMenu className="w-6 h-6" />
			</button>
			<button
				type='button'
				className={`px-4 py-2 mr-2 md:mt-6 md:mr-6 rounded-lg custom-card ${isNavOpen && 'z-10'}`}
				onClick={toggleTheme}
			>
				{theme === 'dark' ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
			</button>
		</div>
		{isNavOpen && (
			<div ref={navRef} className="absolute left-6 md:left-10 w-48 rounded-md">
				<div className='text-black dark:text-white rounded-xl focus:outline-none custom-card'>
					<ul>
						<li className="py-2 px-4 hover:underline cursor-pointer rounded-xl"> <Link href="https://muhammad-zulfikar.github.io">/</Link> </li>
						<li className="py-2 px-4 hover:underline cursor-pointer rounded-xl"> <Link href="https://muhammad-zulfikar.github.io/stats">/stats</Link> </li>
						<li className="py-2 px-4 hover:underline cursor-pointer rounded-xl"> <Link href="https://github.com/muhammad-zulfikar/blog" target='_blank'>/source</Link> </li>
					</ul>
				</div>
			</div>
            )}
	</div>
    );
}
