import { removeBackground } from "@imgly/background-removal";

self.onmessage = async (event) => {
  const { imageDataUrl, config } = event.data;

  try {
    const resultBlob = await removeBackground(imageDataUrl, config);
    self.postMessage({ resultBlob });
  } catch (error) {
    self.postMessage({ error: error });
  }
};