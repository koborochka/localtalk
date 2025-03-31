import { create } from "zustand";
import { User } from "@app/types/User";
import { db } from "@shared/lib/db/indexedDB";

type UserStoreProps = {
	users: User[];
	currentUserId: string | null;
	setUser: (name: string) => void;
    setUserAvatar: (id: string, avatar: string) => void;

	isLoggingIn: boolean;
    isAuth: boolean;
    isGettingUsers: boolean;
    getUsers: () => void;
    Logout: () => void;
};

const channel = new BroadcastChannel("user_channel"); 

export const useUserStore = create<UserStoreProps>((set, get) => {
    const storedUserId = sessionStorage.getItem("currentUserId") || ""
    channel.onmessage = (event) => {
		if (event.data.type === "UPDATE_USERS") {
			set({ users: event.data.users });
		}
        if (event.data.type === "ADD_USER") {
            set((state) => ({
                users: [...state.users, event.data.user]
            }));
        }
    }

    return {
        users: [],
        currentUserId: storedUserId, 
        isLoggingIn: false,
        isGettingUsers: false,
        isAuth: !!storedUserId,

        setUser: async (name) => {
            set({ isLoggingIn: true });
            
            await get().getUsers();
            let users = get().users;
            let user = users.find((u) => u.name === name);
        
            if (!user) {
                user = { id: crypto.randomUUID(), name };
        
                await db.addUser(user);
        
                channel.postMessage({
                    type: "ADD_USER",
                    user
                });
            }
        
            sessionStorage.setItem("currentUserId", user.id);
            set({ currentUserId: user.id, isAuth: true, isLoggingIn: false });       
        },
        
        setUserAvatar: async (id, avatar) => {
            const state = get();
            let users = [...state.users];
            
            let user = users.find((u) => u.id === id);
        
            if (user) {
                user.avatar = avatar;
                
                channel.postMessage({
                    type: "UPDATE_USERS",
                    users
                });
                
                set({ users });

                await db.updateUser(user.id, user);
            }
        },
        getUsers: async () => {     
            set({isGettingUsers: true})
            await db.getAllUsers().then((users) => set({users}))
            set({isGettingUsers: false})
        },
        Logout: () => {
            sessionStorage.removeItem("currentUserId");
            sessionStorage.removeItem("currentChatId");
            set({ currentUserId: null, isAuth: false });
        },        
    }
});
