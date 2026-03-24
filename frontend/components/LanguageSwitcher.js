import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import styles from '../styles/LanguageSwitcher.module.css';
import { getTranslations } from '../lib/i18n';

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = router.locale || 'lt';
  const t = getTranslations(locale);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const switchLocale = (nextLocale) => {
    if (nextLocale === locale) return;
    setOpen(false);
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      undefined,
      { locale: nextLocale }
    );
  };

  if (!mounted) return null;

  return createPortal(
    <nav ref={wrapperRef} className={styles.switcher} aria-label={t.languageSwitcherAria}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{locale === 'lt' ? t.languageLt : t.languageEn}</span>
        <span className={open ? styles.chevronOpen : styles.chevron}>▾</span>
      </button>
      {open ? (
        <div className={styles.menu} role="listbox" aria-label={t.languageSwitcherAria}>
          <button
            type="button"
            role="option"
            aria-selected={locale === 'lt'}
            onClick={() => switchLocale('lt')}
            className={locale === 'lt' ? styles.optionActive : styles.option}
          >
            {t.languageLt}
          </button>
          <button
            type="button"
            role="option"
            aria-selected={locale === 'en'}
            onClick={() => switchLocale('en')}
            className={locale === 'en' ? styles.optionActive : styles.option}
          >
            {t.languageEn}
          </button>
        </div>
      ) : null}
    </nav>,
    document.body
  );
}
