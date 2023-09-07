import React, { createContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import app from "../Firebase/Firebase.init";
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    // Create user with Email
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Update User profile
    const updateUser = (name, photo) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        });
    };

    // Login With email and password
    const loginWithPass = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };
    // Logout
    const logout = () => {
        return signOut(auth);
    };

    const passwordReset = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Google login
    const googleLogin = () => {
        return signInWithPopup(auth, googleProvider);
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            return unsubscribe();
        };
    }, []);

    const authInfo = {
        user,
        logout,
        updateUser,
        createUser,
        loading,
        loginWithPass,
        passwordReset,
        googleLogin,
    };
    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
