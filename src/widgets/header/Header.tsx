import React from 'react';
import { IoChatbubblesSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TbMessageChatbot } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom"; 
import { useUserStore } from '@shared/store/userStore';

export const Header: React.FC = () => {
    const {isAuth, Logout} = useUserStore()
    const navigate = useNavigate()
    const HandleLogout = () =>{
        Logout()
        navigate("/auth",)
        return null;
    }
    return (
        // text-gray-600
        <header className='w-[80vw] h-[8vh] mx-auto flex items-center text-[#6573c7]'>
            <div className='flex flex-1 gap-1 text-3xl '>
                <IoChatbubblesSharp height={50} />
                <p className='text-xl text-center md:text-3xl'>LocalTalk</p>
            </div>
            {isAuth && 
            <div className='flex gap-3'>
                <Link to="/chat" className='flex gap-1 items-center cursor-pointer'>
                    <TbMessageChatbot size={35} />
                    <p className='text-xl hidden md:block'>Chat</p>
                </Link>
                <Link to="/profile" className='flex gap-1 items-center cursor-pointer'>
                    <CgProfile size={30} />
                    <p className='text-xl hidden md:block'>Profile</p>
                </Link>
                <div className='flex gap-1 items-center cursor-pointer' onClick={HandleLogout}>
                    <MdLogout size={30} />
                    <p className='text-xl hidden md:block'>Logout</p>
                </div>
            </div>
            }
        </header>
    );
};
