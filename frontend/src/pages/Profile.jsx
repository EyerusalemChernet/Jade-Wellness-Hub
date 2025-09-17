import { useApi } from "../hooks/useApi.js";
import ProfileForm from "../components/ProfileForm.jsx";

const Profile = () => {
  const { useProfile } = useApi();
  const { data: user, isLoading } = useProfile();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <ProfileForm user={user} />
    </div>
  );
};

export default Profile;