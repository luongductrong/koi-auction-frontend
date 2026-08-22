export function getMockApi(url) {
  if (url.startsWith('/security/login')) {
    return '/login.json';
  }
  if (url.startsWith('/security/password')) {
    return '/change-password.json';
  }
  if (url.startsWith('/user/get-profile')) {
    return '/user-profile.json';
  }
  if (url.startsWith('/user/profile')) {
    return '/user-profile-update.json';
  }
  if (url.startsWith('/security/register')) {
    return '/register-user.json';
  }
  if (url.startsWith('/security/verify-otp')) {
    return '/register-otp.json';
  }
  if (url.startsWith('/verify/verify-email')) {
    return '/register-email.json';
  }
  if (url.startsWith('/verify/verify-userName')) {
    return '/register-username.json';
  }
  if (url.startsWith('/forgot-password/verifyMail')) {
    return '/forgot-verify.json';
  }
  if (url.startsWith('/forgot-password/verifyAndChangePassword')) {
    return '/forgot-change.json';
  }
  if (url.startsWith('/auction/filter')) { // && url.includes('size=4')
    return '/auctions-home.json';
  } else if (url.startsWith('/auction/')) {
    return '/auction-detail.json';
  }
  if (url.startsWith('/auction/user/check-participant-for-auction')) {
    return '/auction-participant.json';
  }
  if (url.startsWith('/bid/get-all')) {
    return '/bid.json';
  }
  if (url.startsWith('/breeder/user')) {
    return '/breeder-home.json';
  }

  return null;
}