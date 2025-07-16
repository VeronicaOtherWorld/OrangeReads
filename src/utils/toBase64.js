export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    //base64 string
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
