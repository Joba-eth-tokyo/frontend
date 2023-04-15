import httpCommon from '@/services/httpCommon';
import type { LoginUser, UserData } from '@/types';

export const createProfile = async (data: UserData) => {
  return httpCommon.post('/auth/create-profile', data);
};

export const getProfile = async (walletAddress: string) => {
  return httpCommon.get(`/auth/profile/${walletAddress}`);
};

export const getUserData = async (walletAddress: string) => {
  return httpCommon.get(`/auth/user/${walletAddress}`);
};

export const login = async (data: LoginUser) => {
  return httpCommon.post('/auth/login', data);
};
