import { useState, useEffect } from 'react';
import { message } from 'antd';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {
  compressImage,
  ProcessedImage,
  isSupportedImage,
  getSupportedFormats,
  formatFileSize as formatSize,
} from '../utils/imageCompressor';

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'compressing' | 'compressed' | 'error';
  error?: string;
  processed?: ProcessedImage;
}

interface UseImageCompressionReturn {
  images: ImageFile[];
  loading: boolean;
  addImages: (files: File[]) => void;
  removeImage: (id: string) => void;
  compressAll: (quality: number) => Promise<void>;
  downloadAll: () => Promise<void>;
  downloadImage: (id: string) => void;
  clearAll: () => void;
  supportedFormats: string[];
  formatFileSize: (bytes: number) => string;
}

export function useImageCompression(): UseImageCompressionReturn {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const supportedFormats = getSupportedFormats();

  // 添加图像文件
  const addImages = (files: File[]) => {
    const newFiles = files.filter(file => {
      // 检查是否为支持的格式
      return isSupportedImage(file);
    });

    if (newFiles.length !== files.length) {
      message.warning('一些文件因格式不受支持而被忽略');
    }

    const imageFiles: ImageFile[] = newFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));

    setImages(prevImages => [...prevImages, ...imageFiles]);
  };

  // 移除单个图像
  const removeImage = (id: string) => {
    setImages(prevImages => {
      const newImages = prevImages.filter(image => image.id !== id);
      // 清理预览URL
      const removedImage = prevImages.find(image => image.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return newImages;
    });
  };

  // 压缩所有图像
  const compressAll = async (quality: number) => {
    if (images.length === 0) {
      message.info('请先添加图像');
      return;
    }

    setLoading(true);

    try {
      // 复制一份图像列表，以便更新状态
      const updatedImages = [...images];

      // 依次压缩每个图像
      for (let i = 0; i < updatedImages.length; i++) {
        const image = updatedImages[i];

        // 更新状态为压缩中
        updatedImages[i] = { ...image, status: 'compressing' };
        setImages([...updatedImages]);

        try {
          // 压缩图像，使用新的压缩方法
          const processed = await compressImage(image.file, { quality });

          // 更新状态为已压缩
          updatedImages[i] = {
            ...image,
            status: 'compressed',
            processed,
          };

          setImages([...updatedImages]);
        } catch (error) {
          console.error('压缩图像失败:', error);
          // 更新状态为错误
          updatedImages[i] = {
            ...image,
            status: 'error',
            error: error instanceof Error ? error.message : '压缩失败',
          };

          setImages([...updatedImages]);
        }
      }

      message.success('图像压缩完成');
    } catch (error) {
      message.error('压缩过程中发生错误');
      console.error('压缩过程错误:', error);
    } finally {
      setLoading(false);
    }
  };

  // 下载单个图像
  const downloadImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image || !image.processed) {
      message.error('图像未压缩或不存在');
      return;
    }

    saveAs(image.processed.blob, image.file.name);
  };

  // 下载所有图像为ZIP
  const downloadAll = async () => {
    const compressedImages = images.filter(img => img.status === 'compressed' && img.processed);

    if (compressedImages.length === 0) {
      message.info('没有已压缩的图像可供下载');
      return;
    }

    try {
      setLoading(true);
      const zip = new JSZip();

      // 添加所有已压缩的图像到ZIP
      for (const image of compressedImages) {
        if (image.processed) {
          zip.file(image.file.name, image.processed.blob);
        }
      }

      // 生成ZIP文件
      const content = await zip.generateAsync({ type: 'blob' });

      // 下载ZIP
      saveAs(content, `compressed_images_${new Date().toISOString().slice(0, 10)}.zip`);

      message.success('压缩包已开始下载');
    } catch (error) {
      message.error('创建压缩包时出错');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 清除所有图像
  const clearAll = () => {
    // 清理所有预览URL
    images.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });

    setImages([]);
  };

  // 组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, []);

  return {
    images,
    loading,
    addImages,
    removeImage,
    compressAll,
    downloadAll,
    downloadImage,
    clearAll,
    supportedFormats,
    formatFileSize: formatSize,
  };
}
