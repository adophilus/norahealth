import type React from "react";

import { IoShareSocialSharp } from "react-icons/io5";

const index: React.FC = () => {
	return (
		<div className="h-max flex flex-row p-4 my-4 relative z-10 justify-between items-center w-[80%]">
			<div>
				<img
					src="/images/logo.jpeg"
					className="rounded-full hover:scale-110 w-[60px] height-[60px] transition"
					alt="logo"
				/>
			</div>
			<div>
				<button
					type="button"
					className="hover:scale-110 transition px-6 py-3 flex flex-row items-center drop-shadow-md cursor-pointer rounded-full bg-neutral-900  "
				>
					Share <IoShareSocialSharp size={26} className="ml-3" />
				</button>
			</div>
		</div>
	);
};

export default index;
