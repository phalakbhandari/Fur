const MAX_EDGE = 900;
const JPEG_QUALITY = 0.82;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Turn a file the visitor picked into a modestly sized JPEG data URL.
 *
 * Listings live in localStorage, which caps out around 5 MB for the whole
 * origin. A photo straight off a phone is 3–6 MB on its own, so it gets
 * redrawn through a canvas at a sane resolution first — a couple of hundred
 * kilobytes instead, which leaves room for more than one listing.
 */
export function processPetPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!ACCEPTED.includes(file.type)) {
      reject(new Error('That file type is not supported. Use a JPG, PNG, or WebP image.'));
      return;
    }

    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error('That image is larger than 8 MB. Try a smaller one.'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      } catch {
        reject(new Error('That image could not be processed. Try a different one.'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('That image could not be read. It may be corrupted.'));
    };

    img.src = objectUrl;
  });
}
