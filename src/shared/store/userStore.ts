import { create } from "zustand";
import { User } from "../../app/types/User";

type UserStore = {
	users: User[];
	currentUser: User | null;
	setUser: (name: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
	users: JSON.parse(localStorage.getItem("users") || "[]"),
	currentUser: null,

	setUser: (name) => {
		set((state) => {
			let users = [...state.users];
			let user = users.find((u) => u.name === name);

			if (!user) {
				user = { id: crypto.randomUUID(), name };
				users.push(user);
			}
            
            localStorage.setItem("users", JSON.stringify(users));
			return { currentUser: user };
		});
	},
}));
