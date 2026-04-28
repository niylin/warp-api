# Warp API

基于 Cloudflare Workers 的 API，用于注册 Warp 和 MASQUE 账户并生成多种格式的配置。

## 接口说明

### 1. WireGuard 注册
- **路径**: `/wg`
- **说明**: 注册 Warp 账户并返回 WireGuard 配置或指定格式。
- **参数**:
  - `format`: 可选。支持 `sing-box` (JSON), `mihomo` (YAML)。默认为标准 WireGuard 配置文件 (Text)。
  - `jwt`: 可选。用于 Cloudflare Access 的 JWT 认证。
  - `model`: 可选。设备型号，默认为 `PC`。
  - `locale`: 可选。语言区域，默认为 `en_US`。

### 2. MASQUE 注册
- **路径**: `/masque`
- **说明**: 注册 Warp 账户并加入 MASQUE 协议支持。
- **参数**:
  - `format`: 可选。支持 `sing-box` (JSON), `mihomo` (YAML)。默认为完整账户数据的 JSON 格式。
  - `jwt`, `model`, `locale`: 同上。

## 示例

- **获取标准 WireGuard 配置**: `https://warp-api.example.com/wg`
- **获取 Mihomo (Clash) 格式的 MASQUE 配置**: `https://warp-api.example.com/masque?format=mihomo`
- **获取 Sing-box 格式的 WireGuard 配置**: `https://warp-api.example.com/wg?format=sing-box`

## 项目结构

- `src/index.ts`: 入口文件，处理路由分发。
- `src/warp.ts`: 处理 Warp 注册逻辑及 WG 格式转换。
- `src/masque.ts`: 处理 MASQUE 注册逻辑及相关格式转换。
- `src/crypto.ts`: 密钥生成工具（Warp 使用 X25519，MASQUE 使用 P-256）。
- `src/config.ts`: 常量与默认配置。
