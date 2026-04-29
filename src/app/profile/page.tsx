import { notFound } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/currentUser';
import {
  getManufacturerProfile,
  getWorkshopProfile,
} from '@/services/userService';
import { ManufacturerProfileForm } from '@/components/profile/ManufacturerProfileForm';
import { WorkshopProfileForm } from '@/components/profile/WorkshopProfileForm';
import { ProfileHeader } from '@/components/profile/ProfileHeader';

const ProfilePage = async () => {
  const { role, userId } = await getServerCurrentUser();

  if (role === 'manufacturer') {
    const profile = await getManufacturerProfile(userId);
    if (!profile) notFound();

    return (
      <div className="mx-auto max-w-2xl space-y-8">
        <ProfileHeader role={role} displayName={profile.name} />
        <ManufacturerProfileForm userId={userId} profile={profile} />
      </div>
    );
  }

  const profile = await getWorkshopProfile(userId);
  if (!profile) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <ProfileHeader role={role} displayName={profile.workshopName} />
      <WorkshopProfileForm userId={userId} profile={profile} />
    </div>
  );
};

export default ProfilePage;
