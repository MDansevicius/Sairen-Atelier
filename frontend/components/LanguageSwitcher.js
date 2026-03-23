import { useRouter } from 'next/router';
import styles from '../styles/LanguageSwitcher.module.css';
import { getTranslations } from '../lib/i18n';

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = router.locale || 'lt';
  const t = getTranslations(locale);

  const switchLocale = (nextLocale) => {
    if (nextLocale === locale) return;
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      undefined,
      { locale: nextLocale }
    );
  };

  return (
    <nav className={styles.switcher} aria-label={t.languageSwitcherAria}>
      <button
        type="button"
        onClick={() => switchLocale('lt')}
        className={locale === 'lt' ? styles.active : styles.link}
      >
        {t.languageLt}
      </button>
      <span className={styles.divider}>/</span>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={locale === 'en' ? styles.active : styles.link}
      >
        {t.languageEn}
      </button>
    </nav>
  );
}
