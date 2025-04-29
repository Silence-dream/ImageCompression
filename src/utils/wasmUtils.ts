/**
 * WebAssembly相关工具函数
 */

/**
 * 检查浏览器是否支持WebAssembly
 * @returns 是否支持WebAssembly
 */
export function checkWasmSupport(): boolean {
  try {
    // 检查WebAssembly对象是否存在
    if (typeof WebAssembly !== 'object') {
      return false;
    }

    // 检查基本方法是否可用
    if (
      typeof WebAssembly.instantiate !== 'function' ||
      typeof WebAssembly.compile !== 'function'
    ) {
      return false;
    }

    // 创建一个最小的WebAssembly模块进行测试
    const module = new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]));

    if (!(module instanceof WebAssembly.Module)) {
      return false;
    }

    // 尝试实例化
    const instance = new WebAssembly.Instance(module);
    return instance instanceof WebAssembly.Instance;
  } catch (e) {
    console.error('检查WebAssembly支持时出错:', e);
    return false;
  }
}

/**
 * 检查WebAssembly资源文件是否可访问
 * @param url WebAssembly文件URL
 * @returns 是否可访问
 */
export async function checkWasmFileAccess(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (e) {
    console.error(`检查WebAssembly文件访问时出错 (${url}):`, e);
    return false;
  }
}

/**
 * 检查WebAssembly文件完整性
 * @returns 检查结果及错误信息
 */
export async function verifyWasmResources(): Promise<{ valid: boolean; error?: string }> {
  try {
    // 检查浏览器支持
    if (!checkWasmSupport()) {
      return {
        valid: false,
        error: '您的浏览器不支持WebAssembly功能',
      };
    }

    // 检查JS文件
    const jsFileAccessible = await checkWasmFileAccess('/wasm/magick.js');
    if (!jsFileAccessible) {
      return {
        valid: false,
        error: 'magick.js文件无法访问，请检查文件是否存在',
      };
    }

    // 检查WASM文件
    const wasmFileAccessible = await checkWasmFileAccess('/wasm/magick.wasm');
    if (!wasmFileAccessible) {
      return {
        valid: false,
        error: 'magick.wasm文件无法访问，请检查文件是否存在',
      };
    }

    return { valid: true };
  } catch (e) {
    console.error('验证WebAssembly资源时出错:', e);
    return {
      valid: false,
      error: `验证WebAssembly资源时出错: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

/**
 * 获取详细的WebAssembly诊断信息
 */
export function getWasmDiagnostics(): Record<string, any> {
  return {
    wasmSupported: typeof WebAssembly === 'object',
    wasmFeatures: {
      instantiate: typeof WebAssembly?.instantiate === 'function',
      compile: typeof WebAssembly?.compile === 'function',
      stream: typeof WebAssembly?.instantiateStreaming === 'function',
      modules: typeof WebAssembly?.Module === 'function',
      instance: typeof WebAssembly?.Instance === 'function',
    },
    browser: {
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
    },
  };
}
