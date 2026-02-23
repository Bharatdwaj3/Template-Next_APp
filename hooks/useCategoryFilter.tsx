import { useSelector, useDispatch } from 'react-redux';
import { setCategory } from '../store/contentSlice';


export const CATEGORIES = [
  { value: 'all',     label: 'All Stories' },
  { value: 'fiction', label: 'Fiction'     },
  { value: 'science', label: 'Science'     },
  { value: 'art',     label: 'Art'         },
  { value: 'daily',   label: 'Daily'       },
  { value: 'history', label: 'History'     },
];

export function useCategoryFilter() {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.content.selectedCategory);

  const handleCategoryClick = (category) => {
    dispatch(setCategory(category));
  };

  return { selectedCategory, handleCategoryClick, CATEGORIES };
}