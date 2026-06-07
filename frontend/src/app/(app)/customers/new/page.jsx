'use client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '../../../../api/client';
import ProfileForm from '../../../../components/ProfileForm';

export default function CreateProfile() {
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const res = await api.post('/customers', data);
      toast.success('Profile created successfully!');
      router.push(`/customers/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create profile');
      throw err;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Fill in the details to create a new matchmaking profile</p>
      </div>
      <div className="card p-6">
        <ProfileForm onSubmit={handleSubmit} submitLabel="Create Profile" />
      </div>
    </div>
  );
}
