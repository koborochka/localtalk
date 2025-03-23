import React from 'react';
import { IoChatbubblesSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export const Header: React.FC = () => {
    return (
        <header className='w-[80vw] h-[8vh] mx-auto flex items-center'>
            <div className='flex flex-1 gap-1 text-3xl text-blue-500'>
                <IoChatbubblesSharp height={50} />
                <p>Localchat</p>
            </div>
            <div className='flex gap-3'>
                <div className='flex text-[#636567] gap-1 items-center'>
                    <CgProfile size={30} className='' />
                    <p className='text-xl'>
                        Profile
                    </p>
                </div>
                <div className='flex text-[#636567] gap-1 items-center'>
                    <MdLogout size={30} className='' />
                    <p className='text-xl'>
                        Logout
                    </p>
                </div>
            </div>
        </header>
    );
};
