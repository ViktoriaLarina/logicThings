export enum Role {
  user = 'user',
  global_admin = 'global_admin',
  engineer = 'engineer'
}

export enum UserStatus {
  activated = 'activated',
  not_activated = 'not_activated'
}

export enum SortFild {
  by_district = 'by_district',
  by_sector = 'by_sector',
  by_device_state = 'by_device_state'
}

export enum SortType {
  asc = 'asc',
  desc = 'desc'
}

export enum SortField {
  by_district = 'by_district',
  by_sector = 'by_sector',
  by_device_state = 'by_device_state'
}

export enum ColorProgressBar {
  warn = 'warn',
  accent = 'accent',
  primary = 'primary'
}

export enum Progress {
  start = 'start',
  midle = 'midle',
  finish = 'finish',
  firstError = 'firstError',
  secondError = 'secondError'
}

export enum ProgressNew {
  start = 'start',
  firstDone = 'firstDone',
  firstError = 'firstError',
  secondDone = 'secondDone',
  secondError = 'secondError',
  thirdDone = 'thirdDone',
  thirdError = 'thirdError',
  fourthDone = 'fouthDone',
  fourthError = 'fouthError',
  fifthDone = 'fifthDone',
  fifthError = 'fifthError'
}

export enum CommentValue {
  lowLevel = 1,
  middleLevel = 2,
  highLevel = 3
}

export enum SampleFlag {
  loraDevice = 10,
  web = 20,
  androidByUsingQRcode = 30,
  androidWithoutUsingQRcode = 31,
  csvFile = 40
}
