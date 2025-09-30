import {getRequestConfig} from 'next-intl/server';
import type {GetRequestConfigParams} from 'next-intl/server';

export default getRequestConfig(async (params: GetRequestConfigParams) => {
  const locale = params.locale ?? 'zh';
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale
  };
}); 