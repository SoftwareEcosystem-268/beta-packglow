export function getCategoryStats(categoryId: string, items: Record<string, { is_packed: boolean }[]>) {
  if (categoryId === "all") {
    let total = 0, completed = 0;
    Object.values(items).forEach(ci => { total += ci.length; completed += ci.filter(i => i.is_packed).length; });
    return { completed, total };
  }
  const ci = items[categoryId] || [];
  return { completed: ci.filter(i => i.is_packed).length, total: ci.length };
}
