"use client";
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState } from 'react';

import {
    signInWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { 
    collection, 
    doc, 
    query, 
    setDoc,
    getDoc,
    getDocs,
    where
} from 'firebase/firestore';

export default function LoginPage({ }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Check apakah user sudah ada di Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (!userDoc.exists()) {
                // Jika user baru, buat data di Firestore
                await setDoc(userDocRef, {
                    createdAt: new Date(),
                    email: user.email,
                    emailVerified: user.emailVerified,
                    isEmailVerified: user.emailVerified,
                    profile: {
                        displayname: user.displayName || user.email.split('@')[0],
                        phonenumber: "",
                        username: user.email.split('@')[0]
                    },
                    role: 'user',
                    uid: user.uid,
                    username: user.email.split('@')[0]
                });
            } else {
                // Update email verification status jika sudah ada
                await setDoc(userDocRef, { 
                    emailVerified: user.emailVerified,
                    isEmailVerified: user.emailVerified 
                }, { merge: true });
            }
            setLoading(false);
            router.push('/');
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
            setLoading(false);
        } else {
            console.error('Google sign-in error:', error);
            setError('Gagal masuk dengan Google. Silakan coba lagi.');
        }
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            // Cari user berdasarkan username di Firestore
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                setError('Username tidak ditemukan.');
                setLoading(false);
                return;
            }
            
            // Ambil email dari user yang ditemukan
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const userEmail = userData.email;
            
            // Login menggunakan email dan password
            const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
            const user = userCredential.user;
            
            if (!user.emailVerified) {
                await signOut(auth);
                setError('Email belum diverifikasi. Silakan check email Anda dan klik link verifikasi.');
                return;
            }
            
            // Update status verifikasi
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { 
                emailVerified: true,
                isEmailVerified: true 
            }, { merge: true });
            
            router.push('/');
        } catch (err) {
            console.error('Login error:', err);
            switch (err.code) {
                case 'auth/invalid-credential':
                case 'auth/wrong-password':
                    setError('Username atau password yang Anda masukkan salah.');
                    break;
                case 'auth/user-disabled':
                    setError('Akun Anda telah dinonaktifkan.');
                    break;
                case 'auth/too-many-requests':
                    setError('Terlalu banyak percobaan login. Coba lagi nanti.');
                    break;
                default:
                    setError('Terjadi kesalahan saat login.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-20">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {/* Logo */}
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        <Image 
                            src="/images/logo_main.png" 
                            alt="LokaBudaya Logo" 
                            width={72}
                            height={72}
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                    <p className="text-gray-600 mt-2">Please fill the form below to login to your account</p>
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</p>}

                {/* Google Sign-in Button */}
                <button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* Facebook Sign-in Button */}
                <button 
                    disabled
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                    <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                </div>

                {/* Basic Form */}
                <form onSubmit={handleUsernameLogin} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            placeholder="Username"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <button type="button" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Don't have account? <button onClick={() => router.push('/register')} className="font-medium text-blue-600 hover:underline">Sign up</button>
                </p>
            </div>
        </div>
    );
}
