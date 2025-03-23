import React from 'react';
import { IoChatbubblesSharp } from "react-icons/io5";

export const Header: React.FC = () => {
    return (
        <header>
            <div className='container'>
                <div className='flex  gap-1 text-3xl text-blue-500'>
                    <IoChatbubblesSharp height={50} />
                    <p>Localchat</p>
                </div>
            </div>
        </header>
    );
};
