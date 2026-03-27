import React from 'react';

const Footer: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Logo image failed to load:', e);
    // 如果图片加载失败，隐藏图片元素
    e.currentTarget.style.display = 'none';
  };

  return (
    <footer className="bg-neutral-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo和联系信息在同一行 */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo在左边 */}
          <div className="flex-shrink-0">
            <img
              src="/images/logo_rec_02@4x-8.png"
              alt="Patch Tattoo Therapy"
              className="h-16 w-auto"
              onError={handleImageError}
            />
          </div>

          {/* 联系信息在右边 */}
          <div className="flex space-x-12 text-right">
            <div>
              <p className="text-sm text-stone-400">185471/2 Ventura Blvd</p>
              <p className="text-sm text-stone-400">Tarzana, CA 91356</p>
            </div>
            <div>
              <p className="text-sm text-stone-400">(818) 857-7937</p>
              <p className="text-sm text-stone-400">info@patchtattootherapy.com</p>
            </div>
          </div>
        </div>

        {/* 版权信息居中 */}
        <div className="text-center border-t border-neutral-800 pt-6">
          <p className="text-sm text-stone-500">© 2026 Patch Tattoo Therapy. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
