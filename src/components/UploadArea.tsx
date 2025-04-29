import React, { useCallback } from 'react';
import { Upload, Typography, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;
const { Title, Text } = Typography;

interface UploadAreaProps {
  onUpload: (files: File[]) => void;
  disabled?: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, disabled = false }) => {
  const handleUpload: UploadProps['customRequest'] = useCallback(
    ({ file }: { file: any }) => {
      if (file instanceof File) {
        onUpload([file]);
      }
    },
    [onUpload]
  );

  // 支持拖拽多个文件上传
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const { files } = e.dataTransfer;
      if (files && files.length > 0 && !disabled) {
        onUpload(Array.from(files));
      }
    },
    [onUpload, disabled]
  );

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    customRequest: handleUpload,
    showUploadList: false,
    accept: 'image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff',
    disabled,
  };

  return (
    <div className="upload-container">
      <Dragger {...uploadProps} className="upload-area" onDrop={handleDrop}>
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <Title level={4} style={{ margin: 0 }}>
            点击或拖拽上传图像
          </Title>
          <Text type="secondary">支持 JPG, PNG, WEBP, GIF, BMP 等格式</Text>
          <Text type="secondary" className="upload-hint">
            可以一次添加多个文件
          </Text>
        </Space>
      </Dragger>
    </div>
  );
};

export default UploadArea;
