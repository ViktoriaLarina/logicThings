export class Pattern {

  static LOGIN_VALIDATOR = '^[0-9]{10}$';
  static NAME_VALIDATOR = '^[a-zA-Zа-яА-Я-]{3,35}$';
  static MIN_LENGTH_PASSWORD = 6;
  static PASSWORD_VALIDATOR = '^[^\\s]{1,40}$';
  static EMAIL_VALIDATOR = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
}
