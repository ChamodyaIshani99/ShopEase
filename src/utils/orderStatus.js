export function getOrderStatus(order) {
  const mins = (Date.now() - order.createdAt) / 60000;
  if (mins < 1) return { label: 'Processing', color: '#F59E0B', icon: 'time-outline' };
  if (mins < 3) return { label: 'On the way', color: '#3B82F6', icon: 'car-outline' };
  return { label: 'Delivered', color: '#10B981', icon: 'checkmark-circle-outline' };
}