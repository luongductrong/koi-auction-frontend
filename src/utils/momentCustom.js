function fromNow(date) {
  try {
    const inputDate = new Date(date);

    if (isNaN(inputDate.getTime())) {
      throw new Error('Định dạng ngày không hợp lệ');
    }

    const now = new Date();
    const diff = now - inputDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 1) return 'Vừa xong';
    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 30) return `${days} ngày trước`;
    if (months < 12) return `${months} tháng trước`;
    return `${years} năm trước`;
  } catch (error) {
    console.error('Đã xảy ra lỗi trong hàm fromNow:', error.message);
    return 'Không xác định';
  }
}

export { fromNow };
