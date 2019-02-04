import {ProgressBarData, SortParam} from '../models/devicesAttentionAll.model';
import {DeviceStateModel, DeviceTypes} from '../models/DeviceState.model';
import {RoleModel, UserStateModel} from '../models/user.model';
import {ColorProgressBar, Progress, ProgressNew, Role, SortField, SortType, UserStatus} from './all_enum';
import {DeviceState} from './DeviceStates';

export interface IMonth {
  value: number;
  viewValue: string;
}

export class StaticData {

  static ALL_OPTION = '*';

  static MY_FORMAT = {
    parse: {
      dateInput: 'LL'
    },
    display: {
      dateInput: 'DD.MM.YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMMMMMM YYYY'
    }
  };

  static StateLabels: DeviceStateModel[] = [
    {
      state: DeviceState.WORKED,
      text: 'рабочий',
      canSetOnInit: true,
      cssClass: 'status-on',
      isForDeviceAttentionPage: false
    },
    {
      state: DeviceState.NOT_WORKED,
      text: 'нерабочий',
      canSetOnInit: false,
      cssClass: 'status-off',
      isForDeviceAttentionPage: true
    },
    {
      state: DeviceState.REPLACED,
      text: 'замененный',
      canSetOnInit: false,
      cssClass: 'status',
      isForDeviceAttentionPage: false
    },
    {
      state: DeviceState.ABSENT,
      text: 'отсутствует',
      canSetOnInit: false,
      cssClass: 'status',
      isForDeviceAttentionPage: true
    },
    {state: DeviceState.NEW, text: 'новый', canSetOnInit: false, cssClass: 'status-on', isForDeviceAttentionPage: true},
    {
      state: DeviceState.NOT_WORKED_CONFIRM,
      text: 'нерабочий (подтверждено)',
      canSetOnInit: false,
      cssClass: 'status-off',
      isForDeviceAttentionPage: false
    },
    {
      state: DeviceState.ABSENT_CONFIRM,
      text: 'отсутствует (подтверждено)',
      canSetOnInit: false,
      cssClass: 'status',
      isForDeviceAttentionPage: false
    }
  ];

  static Role: RoleModel[] = [
    {value: Role.user, text: 'Пользователь'},
    {value: Role.global_admin, text: 'Главный администратор'},
    {value: Role.engineer, text: 'Инженер'}
  ];

  static UserStatus: UserStateModel[] = [
    {value: UserStatus.activated, text: 'Активирован'},
    {value: UserStatus.not_activated, text: 'Не активирован'}
  ];

  static Fields = {
    10: 'country',
    20: 'city',
    30: 'type',
    31: 'name',
    33: 'section',
    40: 'houseNumber',
    50: 'entranceNumber',
    60: 'apartmentNumber',
    70: 'officeNumber',
    80: 'lastName',
    90: 'firstName',
    100: 'patronymic',
    110: 'accountNumber',
    21: 'district'
  };

  static ITEMS_PER_PAGE: number[] = [25, 50, 100];

  static TIME_INTERVAL = 3000;

  static DEVICE_TYPES: DeviceTypes[] = [
    {name: 'Электричество', device_type: 10},
    {name: 'Вода холодная', device_type: 20},
    {name: 'Вода горячая', device_type: 30},
    {name: 'Газ', device_type: 40},
    {name: 'Тепло', device_type: 50}
  ];
  static SORT_PARAMS: SortParam[] = [
    {sortType: SortType.asc, sortField: SortField.by_district, text: 'Районы (а-я)'},
    {sortType: SortType.desc, sortField: SortField.by_district, text: 'Районы (я-а)'},

    {sortType: SortType.asc, sortField: SortField.by_sector, text: 'Участок (а-я)'},
    {sortType: SortType.desc, sortField: SortField.by_sector, text: 'Участок (я-а)'},

    {sortType: SortType.asc, sortField: SortField.by_device_state, text: 'Тип устройства (а-я)'},
    {sortType: SortType.desc, sortField: SortField.by_device_state, text: 'Тип устройства (я-а)'}
  ];

  static PROGRESS_BAR_VALUES: ProgressBarData[] = [
    {
      value: 0,
      text: '0%',
      color: ColorProgressBar.primary,
      progress: Progress.start
    },
    {
      value: 0,
      text: 'не удалось изменить статус',
      color: ColorProgressBar.warn,
      progress: Progress.firstError
    },
    {
      value: 50,
      text: '50%',
      color: ColorProgressBar.primary,
      progress: Progress.midle
    },
    {
      value: 50,
      text: 'не удалось установить величину фикс. расхода',
      color: ColorProgressBar.warn,
      progress: Progress.secondError
    },
    {
      value: 100,
      text: '100%',
      color: ColorProgressBar.primary,
      progress: Progress.finish
    }
  ];

  static PROGRESS_BAR_VALUES_NEW_DEV_STATE: ProgressBarData[] = [
    {
      value: 0,
      text: '0%',
      color: ColorProgressBar.primary,
      progress: ProgressNew.start
    },
    {
      value: 0,
      text: 'не удалось изменить статус нового ПУ',
      color: ColorProgressBar.warn,
      progress: ProgressNew.firstError
    },
    {
      value: 20,
      text: '20%',
      color: ColorProgressBar.primary,
      progress: ProgressNew.firstDone
    },
    {
      value: 40,
      text: '40%',
      color: ColorProgressBar.primary,
      progress: ProgressNew.secondDone
    },
    {
      value: 20,
      text: 'не удалось изменить статус старого ПУ',
      color: ColorProgressBar.warn,
      progress: ProgressNew.secondError
    },
    {
      value: 60,
      text: '60%',
      color: ColorProgressBar.primary,
      progress: ProgressNew.thirdDone
    },
    {
      value: 40,
      text: 'не удалось обновить сектор/№ ПУ нового ПУ',
      color: ColorProgressBar.warn,
      progress: ProgressNew.thirdError
    },
    {
      value: 80,
      text: '80%',
      color: ColorProgressBar.primary,
      progress: ProgressNew.fourthDone
    },
    {
      value: 60,
      text: 'не удалось создать sample для старого ПУ',
      color: ColorProgressBar.warn,
      progress: ProgressNew.fourthError
    },
    {
      value: 100,
      text: '100%',
      color: ColorProgressBar.primary,
      progress: ProgressNew.fifthDone
    },
    {
      value: 80,
      text: 'не удалось создать sample для нового ПУ',
      color: ColorProgressBar.warn,
      progress: ProgressNew.fifthError
    }
  ];

  static Months: IMonth[] = [
    {value: 0, viewValue: 'Январь'} as IMonth,
    {value: 1, viewValue: 'Февраль'} as IMonth,
    {value: 2, viewValue: 'Март'} as IMonth,
    {value: 3, viewValue: 'Апрель'} as IMonth,
    {value: 4, viewValue: 'Май'} as IMonth,
    {value: 5, viewValue: 'Июнь'} as IMonth,
    {value: 6, viewValue: 'Июль'} as IMonth,
    {value: 7, viewValue: 'Август'} as IMonth,
    {value: 8, viewValue: 'Сентябрь'} as IMonth,
    {value: 9, viewValue: 'Октябрь'} as IMonth,
    {value: 10, viewValue: 'Ноябрь'} as IMonth,
    {value: 11, viewValue: 'Декабрь'} as IMonth
  ];
}
