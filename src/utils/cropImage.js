export default function getCroppedImg(file, pixelCrop) {
  const createImage = url => new Promise((res, rej) => {
    const img = new Image();
    img.addEventListener("load", ()=>res(img));
    img.addEventListener("error", e=>rej(e));
    img.src = url;
  });

  return new Promise(async (resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const image = await createImage(reader.result);
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
      };
    } catch (err) { reject(err); }
  });
}
