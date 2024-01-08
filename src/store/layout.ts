import { create } from "zustand";

export interface LayoutState {
	isSideBarOpen: boolean;
	isDrawerOpen: boolean;
	toggleSidebar: () => void;
	toggleDrawer: () => void;
}

export const useLayoutStore = create<LayoutState>()((set) => ({
	isSideBarOpen: true,
	isDrawerOpen: false,
	toggleSidebar: () => {
		return set((state) => ({ isSideBarOpen: !state.isSideBarOpen }));
	},
	toggleDrawer: () => {
		return set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
	},
}));
