import React from 'react';
import { IoChatbubblesSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TbMessageChatbot } from "react-icons/tb";
import { Link } from "react-router-dom"; 

export const Header: React.FC = () => {
    return (
        <header className='w-[80vw] h-[8vh] mx-auto flex items-center'>
            <div className='flex flex-1 gap-1 text-3xl text-gray-600'>
                <IoChatbubblesSharp height={50} />
                <p>LocalTalk</p>
            </div>
            <div className='flex gap-3'>
                <Link to="/chat" className='flex text-gray-600 gap-1 items-center'>
                    <TbMessageChatbot size={35} />
                    <p className='text-xl'>Chat</p>
                </Link>
                <Link to="/profile" className='flex text-gray-600 gap-1 items-center'>
                    <CgProfile size={30} />
                    <p className='text-xl'>Profile</p>
                </Link>
                <Link to="/auth" className='flex text-gray-600 gap-1 items-center'>
                    <MdLogout size={30} />
                    <p className='text-xl'>Logout</p>
                </Link>
            </div>
        </header>
    );
};
