export function formatMatchDate(dateString: string, useUTC = false): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: useUTC ? 'UTC' : 'Asia/Ho_Chi_Minh',
  };
  
  // Format to Vietnamese locale
  let formatted = date.toLocaleDateString('vi-VN', options);
  
  // Capitalize first letter (e.g. "thứ năm" -> "Thứ năm")
  if (formatted) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  
  return formatted;
}

export function formatMatchTime(dateString: string, useUTC = false): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: useUTC ? 'UTC' : 'Asia/Ho_Chi_Minh',
  };
  
  return date.toLocaleTimeString('vi-VN', options);
}

export function isMatchToday(dateString: string, useUTC = false): boolean {
  const date = new Date(dateString);
  const today = new Date();
  
  const tz = useUTC ? 'UTC' : 'Asia/Ho_Chi_Minh';
  
  const dateParts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: tz
  }).format(date);
  
  const todayParts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: tz
  }).format(today);
  
  return dateParts === todayParts;
}
