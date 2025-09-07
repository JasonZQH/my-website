"use client";

import React from "react";
// 从 react-icons 导入品牌logo
import {
  SiApple,
  SiGoogle,
  SiAmazon,
  SiMeta,
  SiTesla,
  SiNetflix,
  SiAdobe,
  SiSalesforce,
  SiOracle,
  SiTencentqq,
  SiAlibabadotcom,
  SiBytedance,
  SiBaidu,
  SiHuawei,
} from "react-icons/si";

// 从 Font Awesome 导入Microsoft logo
import { FaMicrosoft } from "react-icons/fa";

// Logo组件包装器，统一接口
interface LogoProps {
  size?: number;
}

// 美国Top10科技公司Logo组件
export const AppleLogo = ({ size = 24 }: LogoProps) => (
  <SiApple size={size} />
);

export const MicrosoftLogo = ({ size = 24 }: LogoProps) => (
  <FaMicrosoft size={size} />
);

export const GoogleLogo = ({ size = 24 }: LogoProps) => (
  <SiGoogle size={size} />
);

export const AmazonLogo = ({ size = 24 }: LogoProps) => (
  <SiAmazon size={size} />
);

export const MetaLogo = ({ size = 24 }: LogoProps) => (
  <SiMeta size={size} />
);

export const TeslaLogo = ({ size = 24 }: LogoProps) => (
  <SiTesla size={size} />
);

export const NetflixLogo = ({ size = 24 }: LogoProps) => (
  <SiNetflix size={size} />
);

export const AdobeLogo = ({ size = 24 }: LogoProps) => (
  <SiAdobe size={size} />
);

export const SalesforceLogo = ({ size = 24 }: LogoProps) => (
  <SiSalesforce size={size} />
);

export const OracleLogo = ({ size = 24 }: LogoProps) => (
  <SiOracle size={size} />
);

// 中国Top5科技公司Logo组件
export const TencentLogo = ({ size = 24 }: LogoProps) => (
  <SiTencentqq size={size} />
);

export const AlibabaLogo = ({ size = 24 }: LogoProps) => (
  <SiAlibabadotcom size={size} />
);

export const ByteDanceLogo = ({ size = 24 }: LogoProps) => (
  <SiBytedance size={size} />
);

export const BaiduLogo = ({ size = 24 }: LogoProps) => (
  <SiBaidu size={size} />
);

export const HuaweiLogo = ({ size = 24 }: LogoProps) => (
  <SiHuawei size={size} />
);

// 公司信息数据
export const companyLogos = [
  // 美国公司
  { id: 'apple', name: 'Apple', component: AppleLogo, country: 'US', color: '#000000' },
  { id: 'microsoft', name: 'Microsoft', component: MicrosoftLogo, country: 'US', color: '#00BCF2' },
  { id: 'google', name: 'Google', component: GoogleLogo, country: 'US', color: '#4285F4' },
  { id: 'amazon', name: 'Amazon', component: AmazonLogo, country: 'US', color: '#FF9900' },
  { id: 'meta', name: 'Meta', component: MetaLogo, country: 'US', color: '#1877F2' },
  { id: 'tesla', name: 'Tesla', component: TeslaLogo, country: 'US', color: '#CC0000' },
  { id: 'netflix', name: 'Netflix', component: NetflixLogo, country: 'US', color: '#E50914' },
  { id: 'adobe', name: 'Adobe', component: AdobeLogo, country: 'US', color: '#FF0000' },
  { id: 'salesforce', name: 'Salesforce', component: SalesforceLogo, country: 'US', color: '#00A1E0' },
  { id: 'oracle', name: 'Oracle', component: OracleLogo, country: 'US', color: '#F80000' },
  // 中国公司
  { id: 'tencent', name: 'Tencent', component: TencentLogo, country: 'CN', color: '#1AAD19' },
  { id: 'alibaba', name: 'Alibaba', component: AlibabaLogo, country: 'CN', color: '#FF6A00' },
  { id: 'bytedance', name: 'ByteDance', component: ByteDanceLogo, country: 'CN', color: '#FE2C55' },
  { id: 'baidu', name: 'Baidu', component: BaiduLogo, country: 'CN', color: '#2932E1' },
  { id: 'huawei', name: 'Huawei', component: HuaweiLogo, country: 'CN', color: '#FF0000' },
];