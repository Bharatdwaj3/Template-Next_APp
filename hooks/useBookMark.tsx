import { useSelector, useDispatch } from 'react-redux';
import { toggleBookmark } from '../store/contentSlice';

export function useBookmark(id) {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.content.bookmarks);
  const isBookmarked = bookmarks.includes(id);

  const toggle = () => dispatch(toggleBookmark(id));

  return { isBookmarked, toggle, bookmarks };
}