import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // 获取当前语言
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    return segments[1] || 'en'; // 默认为英文
  };

  const currentLocale = getCurrentLocale();
  const isEnglish = currentLocale === 'en';

  const switchLanguage = () => {
    const targetLocale = isEnglish ? 'zh' : 'en';
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/[^/]+/, `/${targetLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={switchLanguage}
      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1"
      title={`切换到${isEnglish ? '中文' : 'English'}`}
    >
      <span>{isEnglish ? '🇺🇸' : '🇨🇳'}</span>
      <span>{isEnglish ? 'EN' : '中'}</span>
    </button>
  );
} 