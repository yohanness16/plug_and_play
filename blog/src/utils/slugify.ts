export function slugify(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-')     
    .replace(/-+/g, '-')      
    .replace(/^-+|-+$/g, '')  
}