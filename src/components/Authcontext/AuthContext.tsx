import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext<UserContext | null>(null)
export interface UserContext {
    isLoggedin: Boolean
    currentUser: {},
    setCurrentUser: React.Dispatch<React.SetStateAction<{}>>
}
export interface UserModal {
    firstName: string,
    lastName: string,
    email: string,
    mobile: string,
    password: string,
    dob: Date,
    userId: string,
    empId: string,
    joinedDate: Date,
    isAdmin: Boolean,
    lastActive: string,
    isActive: Boolean,
    designation: string,
    address: string,
    profileImageUrl: string
}
interface props {
    children: React.ReactNode
}
const AuthContext = ({ children }: props) => {
    const storedDataString = localStorage.getItem("currentUser");
    const storedData = storedDataString ? JSON.parse(storedDataString) : null;
    let user = {}
    if (storedData !== null) {
        user = storedData
    }
    const [currentUser, setCurrentUser] = useState<UserModal | {}>(user)
    const value: UserContext = {
        isLoggedin: (currentUser as UserModal).lastActive  ? true : false,
        currentUser,
        setCurrentUser,
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
export const useUserContext = () => useContext(UserContext)

export default AuthContext