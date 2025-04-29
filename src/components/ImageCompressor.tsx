import React, { useState } from 'react';
import {
  Layout,
  Row,
  Col,
  Card,
  Button,
  Empty,
  Space,
  Slider,
  Typography,
  Divider,
  Statistic,
  Spin,
  Tag,
} from 'antd';
import {
  CompressOutlined,
  DownloadOutlined,
  ClearOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useImageCompression } from '../hooks/useImageCompression';
import ImageCard from './ImageCard';
import UploadArea from './UploadArea';

const { Content, Header, Footer } = Layout;
const { Title, Text } = Typography;

const ImageCompressor: React.FC = () => {
  const {
    images,
    loading,
    addImages,
    removeImage,
    compressAll,
    downloadAll,
    downloadImage,
    clearAll,
    supportedFormats,
    formatFileSize,
  } = useImageCompression();

  const [quality, setQuality] = useState<number>(80);

  // 计算压缩统计数据
  const calculateStats = () => {
    const compressedImages = images.filter(img => img.status === 'compressed' && img.processed);
    if (compressedImages.length === 0) return { count: 0, saved: 0, ratio: 0 };

    const totalOriginal = compressedImages.reduce(
      (sum, img) => sum + (img.processed?.originalSize || 0),
      0
    );
    const totalCompressed = compressedImages.reduce(
      (sum, img) => sum + (img.processed?.compressedSize || 0),
      0
    );
    const savedBytes = totalOriginal - totalCompressed;
    const savedRatio = (savedBytes / totalOriginal) * 100;

    return {
      count: compressedImages.length,
      saved: savedBytes,
      ratio: savedRatio,
    };
  };

  const stats = calculateStats();

  const hasCompressedImages = images.some(img => img.status === 'compressed');
  // const hasPendingImages = images.some(img => img.status === 'pending');

  return (
    <Layout className="app-container">
      <Header className="app-header">
        <div className="header-content">
          <CompressOutlined className="app-logo" />
          <Title level={3} className="app-title">
            图片压缩工具
          </Title>
        </div>
      </Header>

      <Content className="app-content">
        <Spin spinning={loading} tip="处理中..." className="global-spin">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={8} xl={6}>
              <div className="sidebar">
                <Card title="上传图片" className="control-card">
                  <UploadArea onUpload={addImages} disabled={loading} />
                  <div className="format-tags">
                    <Text type="secondary">支持格式: </Text>
                    <div className="tag-container">
                      {supportedFormats.map(format => (
                        <Tag key={format} color="blue">
                          {format.toUpperCase()}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card title="压缩设置" className="control-card compression-options">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div className="quality-slider">
                      <Text>压缩质量: {quality}%</Text>
                      <Slider
                        min={1}
                        max={100}
                        value={quality}
                        onChange={setQuality}
                        disabled={loading}
                        className="quality-control"
                      />
                      <Text type="secondary" className="slider-hint">
                        <InfoCircleOutlined style={{ marginRight: 4 }} />
                        较低的质量可以获得更小的文件大小，但可能影响图像质量
                      </Text>
                    </div>

                    <Button
                      type="primary"
                      icon={<CompressOutlined />}
                      onClick={() => compressAll(quality)}
                      disabled={images.length === 0 || loading}
                      block
                      className="action-button"
                      size="large"
                    >
                      压缩图片
                    </Button>

                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={downloadAll}
                      disabled={!hasCompressedImages || loading}
                      block
                      className="action-button"
                      size="large"
                    >
                      打包下载
                    </Button>

                    <Button
                      danger
                      icon={<ClearOutlined />}
                      onClick={clearAll}
                      disabled={images.length === 0 || loading}
                      block
                      className="action-button"
                      size="large"
                    >
                      清空所有
                    </Button>
                  </Space>
                </Card>

                {images.length > 0 && (
                  <Card title="压缩统计" className="control-card stats-card">
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={12}>
                        <Statistic
                          title="已压缩图片"
                          value={stats.count}
                          suffix={`/ ${images.length}`}
                          className="stat-item"
                        />
                      </Col>
                      <Col xs={12} sm={12}>
                        <Statistic
                          title="平均压缩率"
                          value={stats.ratio.toFixed(1)}
                          suffix="%"
                          precision={1}
                          className="stat-item"
                        />
                      </Col>
                      <Col span={24}>
                        <Statistic
                          title="已节省空间"
                          value={formatFileSize(stats.saved)}
                          valueStyle={{ fontSize: '16px' }}
                          className="stat-item saved-space"
                        />
                      </Col>
                    </Row>
                  </Card>
                )}
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={16} xl={18}>
              <div className="main-content">
                {images.length > 0 ? (
                  <div className="image-list">
                    <div className="list-header">
                      <Title level={4} className="list-title">
                        图片列表 ({images.length})
                      </Title>
                      <Divider className="list-divider" />
                    </div>

                    <div className="image-list-container">
                      <Row gutter={[16, 16]}>
                        {images.map(image => (
                          <Col key={image.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                            <ImageCard
                              image={image}
                              onRemove={removeImage}
                              onDownload={downloadImage}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </div>
                ) : (
                  <Card className="image-list-empty">
                    <Empty
                      description="暂无图片，请添加图片进行压缩"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </Card>
                )}
              </div>
            </Col>
          </Row>
        </Spin>
      </Content>

      <Footer className="app-footer">
        <Text type="secondary">
          图片压缩工具 &copy; {new Date().getFullYear()} - 基于浏览器原生技术
        </Text>
      </Footer>
    </Layout>
  );
};

export default ImageCompressor;
