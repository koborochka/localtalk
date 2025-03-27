import React from 'react';
import { IoChatbubblesSharp } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom"; 
import { useUserStore } from '@shared/store/userStore';
import { PiChatCircleDotsBold } from "react-icons/pi";
export const Header: React.FC = () => {
    const {isAuth, Logout} = useUserStore()
    const navigate = useNavigate()
    const HandleLogout = () =>{
        Logout()
        navigate("/auth",)
        return null;
    }
    return (
        <header className='w-[80vw] h-[8vh] mx-auto flex  text-[#303754]'>
            <div className='flex flex-1 gap-2 text-4xl items-center'>
                <IoChatbubblesSharp height={35} />
                <p className='text-xl text-center md:text-[26px]'>LocalTalk</p>
            </div>
            {isAuth && 
            <div className='flex gap-10'>
                <Link to="/chat" className='flex gap-1 items-center cursor-pointer'>
                    <PiChatCircleDotsBold size={24} />
                    <p className='text-xl hidden md:block'>Chat</p>
                </Link>
                <Link to="/profile" className='flex gap-1 items-center cursor-pointer'>
                    <CgProfile size={24} />
                    <p className='text-xl hidden md:block'>Profile</p>
                </Link>
                <div className='flex gap-1 items-center cursor-pointer' onClick={HandleLogout}>
                    <MdLogout size={24} />
                    <p className='text-xl hidden md:block'>Logout</p>
                </div>
            </div>
            }
        </header>
    );
};
