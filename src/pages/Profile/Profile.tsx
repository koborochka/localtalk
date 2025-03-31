import { useUserStore } from '@shared/store/userStore';
import React, { useEffect, useState } from 'react';
import userAvatarPlaceholder from '@shared/assets/user_placeholder.png';

export const Profile: React.FC = () => {
    const userId = useUserStore((state) => state.currentUserId);
    const user = useUserStore((state) => state.users.find((u) => u.id === userId));
    const setUserAvatar = useUserStore((state) => state.setUserAvatar);
    
    const [avatar, setAvatar] = useState<string>(user?.avatar || userAvatarPlaceholder);

    useEffect(() => {
        if (user?.avatar) {
            setAvatar(user.avatar);
        }
    }, [user?.avatar]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const newAvatar = reader.result as string;
                    setAvatar(newAvatar);
                    if (userId) setUserAvatar(userId, newAvatar);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-wrap justify-center justify-items-center items-center max-w-screen mt-40">
            <div className="flex flex-col items-center gap-4 justify-center bg-gray-50 p-4 pt-8 rounded-lg shadow-md w-[30%] min-w-[250px]">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{user?.name}</h2>
                <div className="flex flex-col items-center gap-2 w-full">

                    <div className="flex flex-col items-center gap-2 w-full">
                        <label htmlFor="avatar" className="flex flex-col items-center text-gray-700 text-sm font-medium mb-2 cursor-pointer">
                            <img
                                src={avatar}
                                alt="Avatar"
                                className="rounded-full w-32 h-32 object-cover mb-4 hover:scale-105 transition-transform"
                            />
                            {!user?.avatar ? 'Измените аватар' : ''}
                        </label>
                        <input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
