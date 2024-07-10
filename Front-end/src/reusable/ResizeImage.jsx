export default function ResizeImage(imageFile) {
    console.log(imageFile); // Add this line to check the type of imageFile
    const maxSize = 1024;
    return new Promise((resolve, reject) => {
        if (!(imageFile instanceof Blob)) {
            return reject(new TypeError('imageFile is not of type Blob'));
        }

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(new File([blob], imageFile.name, { type: imageFile.type }));
                }, imageFile.type);
            };
        };
        reader.onerror = reject;
    });
}
