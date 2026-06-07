'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '../../../../../api/client';
import ProfileForm from '../../../../../components/ProfileForm';

export default function EditProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/customers/${id}`).then(r => setCustomer(r.data)).catch(() => toast.error('Profile not found')).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await api.patch(`/customers/${id}`, data);
      toast.success('Profile updated!');
      router.push(`/customers/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
      throw err;
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading…</div>;
  if (!customer) return <div className="p-12 text-center text-gray-400">Profile not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href={`/customers/${id}`} className="text-sm text-gray-500 hover:text-rose-600 flex items-center gap-1 mb-4">
        ← Back to Profile
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">{customer.firstName} {customer.lastName}</p>
      </div>
      <div className="card p-6">
        <ProfileForm initial={customer} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
