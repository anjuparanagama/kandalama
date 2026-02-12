import { useTranslation } from 'react-i18next';

export default function DummyAdPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('dummyAd.title')}</h1>
      <p>{t('dummyAd.description')}</p>
    </div>
  );
}