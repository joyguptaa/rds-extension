import { APP_URL } from './config';

export function getCookie(name: string) {
  return new Promise((resolve) => {
    window.chrome.cookies.get(
      {
        url: APP_URL,
        name: name,
      },
      (cookie) => {
        resolve(cookie);
      }
    );
  });
}
