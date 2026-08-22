const baseUrl = import.meta.env.BASE_URL;

export function getMockApi(url) {
  if (url.startsWith('/security/login')) {
    return `${baseUrl}login.json`;
  }
  if (url.startsWith('/security/password')) {
    return `${baseUrl}change-password.json`;
  }
  if (url.startsWith('/user/get-profile')) {
    return `${baseUrl}user-profile.json`;
  }
  if (url.startsWith('/user/profile')) {
    return `${baseUrl}user-profile-update.json`;
  }
  if (url.startsWith('/security/register')) {
    return `${baseUrl}register-user.json`;
  }
  if (url.startsWith('/security/verify-otp')) {
    return `${baseUrl}register-otp.json`;
  }
  if (url.startsWith('/verify/verify-email')) {
    return `${baseUrl}register-email.json`;
  }
  if (url.startsWith('/verify/verify-userName')) {
    return `${baseUrl}register-username.json`;
  }
  if (url.startsWith('/forgot-password/verifyMail')) {
    return `${baseUrl}forgot-verify.json`;
  }
  if (url.startsWith('/forgot-password/verifyAndChangePassword')) {
    return `${baseUrl}forgot-change.json`;
  }
  if (url.startsWith('/auction/filter')) { // && url.includes('size=4')
    return `${baseUrl}auctions-home.json`;
  } else if (url.startsWith('/auction/')) {
    return `${baseUrl}auction-detail.json`;
  }
  if (url.startsWith('/auction/user/check-participant-for-auction')) {
    return `${baseUrl}auction-participant.json`;
  }
  if (url.startsWith('/bid/get-all')) {
    return `${baseUrl}bid.json`;
  }
  if (url.startsWith('/breeder/user')) {
    return `${baseUrl}breeder-home.json`;
  }

  return null;
}