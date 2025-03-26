import { create } from "zustand";
import { User } from "../../app/types/User";
import { db } from "@shared/lib/db/indexedDB";

type UserStore = {
	users: User[];
	currentUserId: string | null;
	setUser: (name: string) => void;
    setUserAvatar: (id: string, avatar: string) => void;
};

const channel = new BroadcastChannel("user_channel"); 

export const useUserStore = create<UserStore>((set, get) => {
    db.getAllUsers().then((users) => set({users}))

    const storedUserId = sessionStorage.getItem("currentUserId") || ""

    channel.onmessage = (event) => {
		if (event.data.type === "UPDATE_USERS") {
			set({ users: event.data.users });
		}
    }

    return {
        users: [],
        currentUserId: storedUserId,

        setUser: (name) => {
            set((state) => {
                let users = [...state.users];
                let user = users.find((u) => u.name === name);

                if (!user) {
                    user = { id: crypto.randomUUID(), name };
                    users.push(user);

                    db.addUser(user)
                    channel.postMessage({
                        type: "UPDATE_USERS",
                        users
                    });
                }

                sessionStorage.setItem("currentUserId", user.id);
                return { users, currentUserId: user.id };
            });
        },
        setUserAvatar: async (id, avatar) => {
            const state = get();
            let users = [...state.users];
            
            let user = users.find((u) => u.id === id);
        
            if (user) {
                user.avatar = avatar;
                
                await db.updateUser(user.id, user);
        
                channel.postMessage({
                    type: "UPDATE_USERS",
                    users
                });
        
                set({ users });
            }
        }    
    }
});
