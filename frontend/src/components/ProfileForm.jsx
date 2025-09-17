import { useState } from "react";
import { useApi } from "../hooks/useApi.js";

const ProfileForm = ({ user }) => {
  const { useUpdateProfile } = useApi();
  const { mutate: updateProfile } = useUpdateProfile();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="border p-2 w-full"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 w-full"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password (optional)"
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
    </form>
  );
};

export default ProfileForm;