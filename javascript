let net;

async function loadModel() {
    net = await bodyPix.load();
    document.getElementById('removeBgBtn').disabled = false;
}

document.getElementById('removeBgBtn').addEventListener('click', async () => {
    const input = document.getElementById('imageInput');
    if (!input.files.length) {
        alert('Per favore, carica un\'immagine.');
        return;
    }

    const file = input.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
        const segmentation = await net.segmentPerson(img);
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const mask = bodyPix.toMask(segmentation);
        ctx.putImageData(mask, 0, 0);
        const result = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const resultImg = document.createElement('img');
        resultImg.src = canvas.toDataURL();
        document.getElementById('resultContainer').innerHTML = ''; // Pulisce il contenitore precedente
        document.getElementById('resultContainer').appendChild(resultImg);
    };
});

loadModel();
