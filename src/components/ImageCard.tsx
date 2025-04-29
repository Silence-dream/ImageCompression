import React from 'react';
import { Card, Button, Space, Tooltip, Progress, Typography } from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { ImageFile } from '../hooks/useImageCompression';

const { Text } = Typography;

interface ImageCardProps {
  image: ImageFile;
  onRemove: (id: string) => void;
  onDownload: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRemove, onDownload }) => {
  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // 状态图标
  const getStatusIcon = () => {
    switch (image.status) {
      case 'compressing':
        return <LoadingOutlined style={{ color: '#1890ff' }} />;
      case 'compressed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  // 是否可下载
  const canDownload = image.status === 'compressed' && image.processed;

  return (
    <Card
      hoverable
      className="image-card"
      cover={
        <div className="image-preview">
          <img
            alt={image.file.name}
            src={image.preview}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      }
      actions={[
        <Tooltip title="删除">
          <Button type="text" icon={<DeleteOutlined />} onClick={() => onRemove(image.id)} />
        </Tooltip>,
        <Tooltip title={canDownload ? '下载压缩图像' : '未压缩'}>
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => canDownload && onDownload(image.id)}
            disabled={!canDownload}
          />
        </Tooltip>,
      ]}
      bodyStyle={{ padding: '12px' }}
    >
      <div className="image-info">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text
            ellipsis={{ tooltip: image.file.name }}
            style={{ width: '100%', fontWeight: 'bold' }}
          >
            {image.file.name}
          </Text>

          <Space>
            {getStatusIcon()}
            <Text type={image.status === 'error' ? 'danger' : undefined}>
              {image.status === 'pending' && '等待压缩'}
              {image.status === 'compressing' && '压缩中...'}
              {image.status === 'compressed' && '压缩完成'}
              {image.status === 'error' && (image.error || '压缩失败')}
            </Text>
          </Space>

          {image.processed && (
            <>
              <div className="size-info">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  原始大小: {formatFileSize(image.processed.originalSize)}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  压缩后: {formatFileSize(image.processed.compressedSize)}
                </Text>
                <Tooltip title={`节省了 ${image.processed.compressionRatio.toFixed(1)}%`}>
                  <Progress
                    percent={Number(image.processed.compressionRatio.toFixed(1))}
                    size="small"
                    status="active"
                    strokeColor={{
                      from: '#108ee9',
                      to: '#87d068',
                    }}
                  />
                </Tooltip>
              </div>
            </>
          )}
        </Space>
      </div>
    </Card>
  );
};

export default ImageCard;
