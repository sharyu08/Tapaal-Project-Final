import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import { useForceRerender } from '../hooks/useForceRerender';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const forceRerender = useForceRerender();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    console.log('Changing language to:', languageCode);
    i18n.changeLanguage(languageCode, (err, t) => {
      if (err) {
        console.error('Error changing language:', err);
      } else {
        console.log('Language changed successfully to:', languageCode);
        console.log('Test translation:', t('department.title'));
        // Force re-render of all components
        forceRerender();
      }
    });
    // Close dropdown after selection
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 px-3 py-2"
        onClick={() => {
          const dropdown = document.getElementById('language-dropdown');
          if (dropdown) {
            dropdown.classList.toggle('hidden');
          }
        }}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.nativeName}</span>
        <ChevronDown className="w-3 h-3" />
      </Button>

      {/* Dropdown Menu */}
      <div
        id="language-dropdown"
        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden"
      >
        <div className="py-2 max-h-80 overflow-y-auto">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 ${currentLanguage.code === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="text-lg">{language.flag}</span>
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </div>
              {currentLanguage.code === language.code && (
                <div className="ml-auto">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
