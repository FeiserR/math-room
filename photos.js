import { staticHosting } from './config.js';

const asset = relative => new URL(relative, import.meta.url).href;
let database;
const objectURLs = new Map();

function openDatabase() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open('math-room-photos-v1', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('photos', { keyPath: 'name' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { database = undefined; reject(new Error('Photo storage is unavailable in this browser.')); };
  });
  return database;
}

async function storedPhotos() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('photos', 'readonly');
    const request = transaction.objectStore('photos').getAll();
    transaction.oncomplete = () => resolve(request.result);
    transaction.onerror = () => reject(new Error('Unable to load your browser photos.'));
  });
}

export async function loadPhotos() {
  const response = await fetch(asset(staticHosting ? './worksheets.json' : './api/photos'), { cache: 'no-cache' });
  if (!response.ok) throw new Error('Unable to load the worksheet library. Please refresh and try again.');
  const shared = (await response.json()).map(photo => ({ ...photo, url: new URL(photo.url, import.meta.url).href }));
  if (!staticHosting) return { photos: shared };
  let personal;
  try { personal = await storedPhotos(); }
  catch (error) { return { photos: shared, warning: error.message }; }
  for (const photo of personal) {
    if (!objectURLs.has(photo.name)) objectURLs.set(photo.name, URL.createObjectURL(photo.blob));
  }
  return { photos: [...shared, ...personal.map(photo => ({ name: photo.name, url: objectURLs.get(photo.name), personal: true }))] };
}

export async function addPhoto(file) {
  if (!/\.(jpe?g|png|webp)$/i.test(file.name)) throw new Error('Choose a JPG, PNG, or WebP image.');
  if (file.size > 15 * 1024 * 1024) throw new Error(`${file.name} is too large (15 MB maximum).`);
  // Validate the actual image before saving, regardless of the filename.
  try { const bitmap = await createImageBitmap(file); bitmap.close(); }
  catch { throw new Error(`${file.name} is not a readable image.`); }
  if (staticHosting) {
    const db = await openDatabase();
    const name = `personal-${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('photos', 'readwrite');
      transaction.objectStore('photos').add({ name, blob: file });
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(new Error('Could not save this photo. Your browser storage may be full.'));
      transaction.onabort = () => reject(new Error('Could not save this photo. Your browser storage may be full.'));
    });
    return;
  }
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Unable to read this file.'));
    reader.readAsDataURL(file);
  });
  const response = await fetch(asset('./api/photos'), {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, data })
  });
  if (!response.ok) throw new Error((await response.json()).error || 'Upload failed. Please try again.');
}
