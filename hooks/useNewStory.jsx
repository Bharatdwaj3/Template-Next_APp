import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import api from '../util/api';


export function useNewStory() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.avatar);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('history');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: true,
        orderedList: true,
      }),
    ],
    content: '<p>Start writing your story here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 text-foreground',
      },
    },
  });

  const isPublishDisabled = saving || !title.trim() || !editor?.getText().trim();

  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !editor?.getText().trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      await api.post('/content', {
        title,
        description: editor.getHTML(),
        category,
        mediaType: 'text',
      });
      navigate('/writer');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to publish story');
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    editor,
    title,
    setTitle,
    category,
    setCategory,
    saving,
    error,
    isPublishDisabled,
    handlePublish,
    navigate,
  };
}