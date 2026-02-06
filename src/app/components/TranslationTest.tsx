import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function TranslationTest() {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLang(i18n.language);
      console.log('Language changed to:', i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg mb-4">
      <h3 className="font-bold text-lg mb-2">Translation Debug Info:</h3>
      <p><strong>Current Language:</strong> {currentLang}</p>
      <p><strong>i18n.language:</strong> {i18n.language}</p>
      <p><strong>Translation Test:</strong> {t('department.title')}</p>
      <p><strong>Common Test:</strong> {t('common.save')}</p>
      <p><strong>Inward Mail Test:</strong> {t('inwardMail.subject')}</p>
      <div className="mt-3 space-x-2">
        <button
          onClick={() => i18n.changeLanguage('en')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          English
        </button>
        <button
          onClick={() => i18n.changeLanguage('hi')}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Hindi
        </button>
        <button
          onClick={() => i18n.changeLanguage('mr')}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
        >
          Marathi
        </button>
      </div>
    </div>
  );
}
