import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getUserByUID } from '@/backend/firebase/config';
import { UserInfo } from "@/backend/interficie/UserInfoInterficie";

interface UserContextType {
  userInfo: UserInfo;
  updateUserInfo: (newInfo: Partial<UserInfo>) => void;
}

const defaultUserInfo: UserInfo = {
  email: "null",
  fullName: "User Not Registered",
  userId: "null",
  plan: "null",
  isLocked: "true",
  profile_img: "https://drive.google.com/file/d/1ghxS5ymI1Je8SHSztVtkCxnKFbUQDqim/view?usp=drive_link"
};

const UserContext = createContext<UserContextType>({
  userInfo: defaultUserInfo,
  updateUserInfo: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserByUID(user.uid);
          setUserInfo(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserInfo = (newInfo: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...newInfo }));
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
