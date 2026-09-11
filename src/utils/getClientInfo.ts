export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;

  let device = "Unknown";

  if (/Android/i.test(userAgent)) {
    device = "Android";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    device = "iOS";
  } else if (/Windows/i.test(userAgent)) {
    device = "Windows";
  } else if (/Mac OS X|Macintosh/i.test(userAgent)) {
    device = "macOS";
  } else if (/Linux/i.test(userAgent)) {
    device = "Linux";
  }

  let browser = "Unknown";

  if (/Edg/i.test(userAgent)) {
    browser = "Edge";
  } else if (/OPR|Opera/i.test(userAgent)) {
    browser = "Opera";
  } else if (/Chrome/i.test(userAgent)) {
    browser = "Chrome";
  } else if (/Firefox/i.test(userAgent)) {
    browser = "Firefox";
  } else if (/Safari/i.test(userAgent)) {
    browser = "Safari";
  }

  return {
    device,
    browser,
  };
};