import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { markAsVisited } from '../store/contentSlice';
import api from '../util/api';

export function useContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get(`/content/${id}`);
        setContent(res.data);
        setLoading(false);
        dispatch(markAsVisited(id));
      } catch (err) {
        console.error(err);
        navigate('/content', { replace: true });
      }
    };
    fetchContent();
  }, [id, navigate, dispatch]);

  return { content, loading, id };
}