import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import ImageCompressor from './components/ImageCompressor';
import './App.css';
function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#1890ff' } }}>
      <ImageCompressor />
    </ConfigProvider>
  );
}

export default App;
