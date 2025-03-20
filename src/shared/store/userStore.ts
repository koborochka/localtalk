import { create } from "zustand";
import { User } from "../../app/types/User";

type UserStore = {
	users: User[];
	currentUserId: string | null;
	setUser: (name: string) => void;
};

const channel = new BroadcastChannel("user_channel"); 

export const useUserStore = create<UserStore>((set) => {

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const storedUserId = sessionStorage.getItem("currentUserId") || ""

    channel.onmessage = (event) => {
		if (event.data.type === "UPDATE_USERS") {
			set({ users: event.data.users });
		}
    }

    return {
        users: storedUsers,
        currentUserId: storedUserId,

        setUser: (name) => {
            set((state) => {
                let users = [...state.users];
                let user = users.find((u) => u.name === name);

                if (!user) {
                    user = { id: crypto.randomUUID(), name };
                    users.push(user);

                    localStorage.setItem("users", JSON.stringify(users));
                    channel.postMessage({
                        type: "UPDATE_USERS",
                        users
                    });
                }

                sessionStorage.setItem("currentUserId", user.id);
                return { users, currentUserId: user.id };
            });
        },
    }
});
