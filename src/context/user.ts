import { createContext } from "react";

import { UserStore } from "@/store/user";

export const UserContext = createContext<UserStore | null>(null);
