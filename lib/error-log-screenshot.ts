/** Client-only: resize + JPEG encode so screenshots fit localStorage. */

const MAX_DATA_URL_LENGTH = 700_000;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode image'));
    img.src = url;
  });
}

function drawToJpeg(img: HTMLImageElement, maxWidth: number, quality: number): string {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!w || !h) return '';
  const scale = w > maxWidth ? maxWidth / w : 1;
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(img, 0, 0, cw, ch);
  return canvas.toDataURL('image/jpeg', quality);
}

export type CompressImageResult =
  | { ok: true; dataUrl: string; name: string }
  | { ok: false; error: string };

/**
 * Accepts any reasonable screenshot size; compresses to JPEG under ~MAX_DATA_URL_LENGTH.
 */
export async function compressImageFileToDataUrl(file: File): Promise<CompressImageResult> {
  if (typeof window === 'undefined') {
    return { ok: false, error: 'Screenshots are only available in the browser.' };
  }
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Please upload an image file.' };
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    let maxW = 1200;
    let quality = 0.85;

    for (let attempt = 0; attempt < 12; attempt++) {
      const dataUrl = drawToJpeg(img, maxW, quality);
      if (!dataUrl) {
        return { ok: false, error: 'Could not process this image.' };
      }
      if (dataUrl.length <= MAX_DATA_URL_LENGTH) {
        const base = file.name.replace(/\.[^.]+$/, '') || 'screenshot';
        return { ok: true, dataUrl, name: `${base}.jpg` };
      }
      quality -= 0.07;
      maxW = Math.floor(maxW * 0.88);
      if (quality < 0.42) quality = 0.42;
      if (maxW < 420) maxW = 420;
    }

    return {
      ok: false,
      error: 'Image stays too large after compression. Try a smaller crop or export.',
    };
  } catch {
    return { ok: false, error: 'Could not read image file.' };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
