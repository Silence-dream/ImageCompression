import imageCompression from 'browser-image-compression';

/**
 * 处理后的图像信息接口
 */
export interface ProcessedImage {
  name: string;
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

/**
 * 压缩图像配置选项
 */
export interface CompressionOptions {
  /** 压缩质量 (1-100) */
  quality?: number;
  /** 最大宽度（可选） */
  maxWidth?: number;
  /** 最大高度（可选） */
  maxHeight?: number;
  /** 是否保持宽高比 */
  preserveAspectRatio?: boolean;
}

/**
 * 使用Canvas API压缩图像
 * @param file 图像文件
 * @param options 压缩选项
 * @returns 处理后的图像信息
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<ProcessedImage> {
  try {
    // 设置默认值
    const quality = options.quality !== undefined ? options.quality / 100 : 0.8;

    // 压缩配置
    const compressionOptions = {
      maxSizeMB: 10, // 最大文件大小限制（MB）
      maxWidthOrHeight: Math.max(options.maxWidth || 1920, options.maxHeight || 1080),
      useWebWorker: true, // 使用WebWorker提高性能
      maxIteration: 10, // 最大迭代次数
      initialQuality: quality,
      alwaysKeepResolution: !options.maxWidth && !options.maxHeight, // 如果没有指定宽高，保持原始分辨率
    };

    console.log(`开始压缩图片: ${file.name}, 原始大小: ${(file.size / 1024).toFixed(2)} KB`);

    // 执行压缩
    const compressedBlob = await imageCompression(file, compressionOptions);

    // 计算压缩比
    const originalSize = file.size;
    const compressedSize = compressedBlob.size;
    const compressionRatio = (1 - compressedSize / originalSize) * 100;

    console.log(
      `图片压缩完成: ${file.name}, 压缩后大小: ${(compressedSize / 1024).toFixed(2)} KB, 压缩率: ${compressionRatio.toFixed(2)}%`
    );

    // 返回处理结果
    return {
      name: file.name,
      blob: compressedBlob,
      originalSize: originalSize,
      compressedSize: compressedSize,
      compressionRatio: compressionRatio,
    };
  } catch (error) {
    console.error('压缩图像时出错:', error);
    throw error;
  }
}

/**
 * 获取支持的图像格式列表
 */
export function getSupportedFormats(): string[] {
  return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
}

/**
 * 检查图像格式是否支持
 * @param file 图像文件
 */
export function isSupportedImage(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return getSupportedFormats().includes(extension);
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
