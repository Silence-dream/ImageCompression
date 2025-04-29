/// <reference types="vite/client" />

// 声明browser-image-compression模块
declare module 'browser-image-compression' {
  interface ImageCompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    maxIteration?: number;
    initialQuality?: number;
    alwaysKeepResolution?: boolean;
    signal?: AbortSignal;
    exifOrientation?: number;
    fileType?: string;
    onProgress?: (progress: number) => void;
    preserveExif?: boolean;
  }

  /**
   * 压缩图像
   * @param file 要压缩的文件
   * @param options 压缩选项
   * @returns Promise<Blob> 压缩后的图像blob
   */
  export default function imageCompression(
    file: File,
    options: ImageCompressionOptions
  ): Promise<Blob>;
}

// 补充JSZip类型
declare module 'jszip' {
  export interface JSZip {
    file(name: string, data: Blob | ArrayBuffer | Uint8Array | string, options?: any): this;
    generateAsync(options: { type: string }): Promise<Blob>;
  }
  const JSZip: {
    new(): JSZip;
  };
  export default JSZip;
}

// 补充文件保存类型
declare module 'file-saver' {
  export function saveAs(data: Blob | string, filename?: string, options?: any): void;
}
