import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../util/api';


export function useProfile(endpoint) {
  const { user } = useSelector((state) => state.avatar);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          setProfile(user);
          setLoading(false);
          return;
        }
        const { data } = await api.get(endpoint);
        setProfile(data);
        setLoading(false);
      } catch (e) {
        console.error('Failed to fetch profile:', e);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, endpoint]);

  return { profile, loading, user };
}