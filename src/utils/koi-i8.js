function koiOrigin(origin) {
  origin = origin?.toLowerCase() || '';
  switch (origin) {
    case 'japan':
      return 'Nhật Bản';
    case 'china':
      return 'Trung Quốc';
    case 'vietnam':
      return 'Việt Nam';
    case 'thailand':
      return 'Thái Lan';
    case 'indonesia':
      return 'Indonesia';
    case 'malaysia':
      return 'Malaysia';
    case 'philippines':
      return 'Philippines';
    case 'korea':
      return 'Hàn Quốc';
    case 'taiwan':
      return 'Đài Loan';
    case 'another':
      return 'Khác';
    case 'other':
      return 'Khác';
    case '':
      return 'Không xác định';
    default:
      return origin;
  }
}

export { koiOrigin };
