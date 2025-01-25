import { useEffect, useRef, useState } from "react";

// Define the configuration type
interface BgRemovalConfig {
  publicPath?: string;
  debug?: boolean;
  device?: 'cpu' | 'gpu';
  proxyToWorker?: boolean;
  model?: 'isnet' | 'isnet_fp16' | 'isnet_quint8';
  output?: {
    format?: 'image/png' | 'image/jpeg' | 'image/webp';
    quality?: number;
    type?: 'foreground' | 'background' | 'mask';
  };
}

const defaultConfig: BgRemovalConfig = {
  debug: false,
  device: 'cpu',
  proxyToWorker: true,
  model: 'isnet_quint8',
  output: {
    format: 'image/png',
    quality: 1,
    type: 'foreground'
  }
};

const useBgRemoval = (imageDataUrl: string | null, config: BgRemovalConfig = defaultConfig) => {
  const [loading, setLoading] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!imageDataUrl) return;

    let worker: Worker | null = null;

    const processImage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create a new worker
        worker = new Worker(
          new URL('@/worker/bg-removal-worker.ts', import.meta.url),
          { type: "module" }
        );

        worker.onmessage = (event) => {
          if (!mounted.current) return;
          
          setLoading(false);
          if (event.data.error) {
            setError(event.data.error);
          } else {
            setResultBlob(event.data.resultBlob);
          }
        };

        worker.postMessage({ imageDataUrl, config });
        workerRef.current = worker;

      } catch (err) {
        if (mounted.current) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    processImage();

    return () => {
      mounted.current = false;
      if (worker) {
        worker.terminate();
      }
      setResultBlob(null);
      setError(null);
    };
  }, [imageDataUrl, config]);

  return { loading, resultBlob, error };
};

export default useBgRemoval;