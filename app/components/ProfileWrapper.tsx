'use client';
import { useProfile } from '../context/ProfileContext';
import ProfileSheet from './ProfileSheet';

export default function ProfileWrapper() {
  const { isProfileOpen, closeProfile } = useProfile();

  return <ProfileSheet isOpen={isProfileOpen} onClose={closeProfile} />;
}
