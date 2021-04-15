import { Inject, Injectable, InjectionToken } from '@angular/core';

export const DEFAULT_LOCALE = new InjectionToken<string>('test');

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private locale = 'en';

  private translation = {
    en: { hello: 'Hello' },
    es: { hello: 'Hola!' },
    fr: { hello: 'Bonjour!' },
    kr: { hello: '안녕하세요!' },
    zh: { hello: '你好!' },
  };

  constructor(@Inject(DEFAULT_LOCALE) defaultLocale: string | null) {
    if (defaultLocale) {
      this.setLocale(defaultLocale);
    }
  }

  setLocale(locale) {
    this.locale = locale;
  }

  getTranslation(key: string) {
    return this.translation[this.locale][key] ?? key;
  }
}
