import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
  const { user, setUser, saveUser, logout } = useContext(AuthContext);

  const isAuthenticated = !!user;

  async function login(formData) {
    const res = await fetch(
      `http://localhost:3000/users?email=${formData.email}`,
    );

    const users = await res.json();

    const existingUser = users[0];

    if (!existingUser) {
      return { success: false, field: 'email', message: 'User not found' };
    }

    if (existingUser.password !== formData.password) {
      return {
        success: false,
        field: 'password',
        message: 'Incorrect password',
      };
    }

    saveUser(existingUser);

    return {
      success: true,
      firstName: existingUser.firstName,
      role: existingUser.role,
    };
  }

  async function signup(formData) {
    const resCheck = await fetch(
      `http://localhost:3000/users?email=${formData.email}`,
    );

    const existing = await resCheck.json();

    if (existing.length > 0) {
      return {
        success: false,
        field: 'email',
        message: 'Email already exists',
      };
    }

    const newUser = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      role: formData.role || 'member',
    };

    const res = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    const savedUser = await res.json();

    saveUser(savedUser);

    return {
      success: true,
      firstName: savedUser.firstName,
      role: savedUser.role,
    };
  }

  return {
    user,
    setUser,
    role: user?.role,
    isAuthenticated,
    login,
    signup,
    logout,
  };
}
