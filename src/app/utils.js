let counter = 0;

export function generateUniqueId() {
  counter++;
  return `element-${counter}-${Date.now()}`;
}
