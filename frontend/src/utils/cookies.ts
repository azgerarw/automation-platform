const getCookie = (name: string) => {
  const cookieMatch = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`));
  return cookieMatch ? decodeURIComponent(cookieMatch.split('=')[1]) : null;
};

export default getCookie;
