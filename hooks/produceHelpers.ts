// hooks/produceHelpers.ts

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: diffDays > 365 ? 'numeric' : undefined,
  });
};

export const formatPrice = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPricePerUnit = (price: number, unit: string): string => {
  return `${formatPrice(price)} / ${unit}`;
};

export const freshnessLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffHrs < 6) return 'Just harvested';
  if (diffHrs < 24) return 'Harvested today';
  if (diffHrs < 48) return 'Harvested yesterday';
  return 'Fresh stock';
};

export const parseRating = (rating: number) => ({
  filled: Math.round(rating),
  empty: 5 - Math.round(rating),
});