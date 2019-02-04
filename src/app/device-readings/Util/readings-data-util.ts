export function readingsParse(data, period, type) {
  const returnData = [];
  const deviceReadingsData = [];
  switch  (type) {
    case 'day': {
      // for (let p = 0; p < 24; p++) {
      //   deviceReadingsData[p] = {
      //     // period: p + ':00',
      //     // periodTill: '-' + (p + 1) + ':00',
      //     data: 0,
      //     endData: 0,
      //     consumption: 0,
      //     timeStamp: 0,
      //     attached: {},
      //   };
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            deviceReadingsData.push(data[i]);
          } else {
            if (new Date(data[i].sample_time).getDate() ===
              new Date(period.endingDate).getDate()) {
              if (!data[i + 1]) {
                deviceReadingsData.push(data[i]);
              } else if (new Date(data[i].sample_time).getHours() !== new Date(data[i + 1].sample_time).getHours()) {
                deviceReadingsData.push(data[i]);
              }
              if (deviceReadingsData[deviceReadingsData.length - 2]) {
                deviceReadingsData[deviceReadingsData.length - 1].prew = deviceReadingsData[deviceReadingsData.length - 2].value;
              } else {
                deviceReadingsData[deviceReadingsData.length - 1].prew = 0;
              }
            }
          }
          // if (new Date(data[i].time).getDate() ===
          //   new Date(period.endingDate).getDate() &&
          //   new Date(data[i].time).getHours() === p) {
          //
          //   if (!data[i - 1]) {
          //     deviceReadingsData[p].beginData = +data[i].value;
          //   } else if (new Date(data[i - 1].time).getHours() !== p) {
          //     deviceReadingsData[p].beginData = +data[i - 1].value;
          //   }
          //   if (!data[i + 1]) {
          //     deviceReadingsData[p].endData = +data[i].value;
          //     deviceReadingsData[p].timeStamp = data[i].time;
          //     deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
          //     break;
          //   } else if (new Date(data[i + 1].time).getHours() !== p) {
          //     deviceReadingsData[p].endData = +data[i].value;
          //     deviceReadingsData[p].timeStamp = data[i].time;
          //     deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
          //     break;
          //   }
          // }
        }
      // }
      // deviceReadingsData.forEach((item) => {
      //   if (item.beginData !== 0 ||
      //     item.endData !== 0 ||
      //     item.consumption !== 0) {
      //
      //     returnData.push(item);
      //   }
      // });
      return deviceReadingsData;
    }
    case 'month': {
      for (let p = 0; p < 31; p++) {
        deviceReadingsData[p] = {
          periodFrom: p + 1,
          periodTill: '',
          beginData: 0,
          endData: 0,
          consumption: 0
        };
        for (let i = 0; i < data.length; i++) {
          if (new Date(data[i].sample_time).getMonth() ===
            new Date(period.endingDate).getMonth() &&
            new Date(data[i].sample_time).getDate() === p + 1) {

            if (!data[i - 1]) {
              deviceReadingsData[p].beginData = +data[i].value;
            } else if (new Date(data[i - 1].sample_time).getDate() !== p + 1) {
              deviceReadingsData[p].beginData = +data[i - 1].value;
            }
            if (!data[i + 1]) {
              deviceReadingsData[p].endData = +data[i].value;
              deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
              break;
            } else if (new Date(data[i + 1].sample_time).getDate() !== p + 1) {
              deviceReadingsData[p].endData = +data[i].value;
              deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
              break;
            }
          }
        }
      }
      deviceReadingsData.forEach((item) => {
        if (item.beginData !== 0 ||
          item.endData !== 0 ||
          item.consumption !== 0) {

          returnData.push(item);
        }
      });
      return returnData;
    }
    case 'year': {
      for (let p = 0; p < 12; p++) {
        deviceReadingsData[p] = {
          periodFrom: p + 1 + '.' + new Date(period.endingDate).getFullYear(),
          periodTill: '',
          beginData: 0,
          endData: 0,
          consumption: 0
        };
        for (let i = 0; i < data.length; i++) {
          if (new Date(data[i].sample_time).getFullYear() ===
            new Date(period.endingDate).getFullYear() &&
            new Date(data[i].sample_time).getMonth() === p) {

            if (!data[i - 1]) {
              deviceReadingsData[p].beginData = +data[i].value;
            } else if (new Date(data[i - 1].sample_time).getMonth() !== p) {
              deviceReadingsData[p].beginData = +data[i - 1].value;
            }
            if (!data[i + 1]) {
              deviceReadingsData[p].endData = +data[i].value;
              deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
              break;
            } else if (new Date(data[i + 1].sample_time).getMonth() !== p) {
              deviceReadingsData[p].endData = +data[i].value;
              deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
              break;
            }
          }
        }
      }
      deviceReadingsData.forEach((item) => {
        if (item.beginData !== 0 ||
          item.endData !== 0 ||
          item.consumption !== 0) {

          returnData.push(item);
        }
      });
      return returnData;
    }
    case 'quarter': {
      // this.periodUnits = ', месяцы';
      for (let p = 0; p < 12; p++) {
        deviceReadingsData[p] = {
          periodFrom: p + 1,
          periodTill: '',
          beginData: 0,
          endData: 0,
          consumption: 0
        };
        for (let i = 0; i < data.length; i++) {
          if (new Date(data[i].sample_time).getFullYear() ===
            new Date(period.endingDate).getFullYear() &&
            new Date(data[i].sample_time).getMonth() === p) {

            if (!data[i - 1] || new Date(data[i - 1].sample_time).getMonth() !== p) {
              deviceReadingsData[p].beginData = +data[i].value;
            } else if (new Date(data[i - 1].sample_time).getMonth() !== p) {
              deviceReadingsData[p].beginData = +data[i - 1].value;
            }
            if (!data[i + 1]) {
              deviceReadingsData[p].endData = +data[i].value;
              deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
              break;
            } else if (new Date(data[i + 1].sample_time).getMonth() !== p) {
              deviceReadingsData[p].endData = +data[i].value;
              deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
              break;
            }
          }
        }
      }
      deviceReadingsData.forEach((item) => {
        if (item.beginData ||
          item.endData ||
          item.consumption ||
          (item.periodFrom > new Date(period.endingDate).getMonth() - 2 &&
            item.periodFrom <= new Date(period.endingDate).getMonth() + 1)) {

          returnData.push(item);
        }
      });
      return returnData;
    }
    case 'period': {
      if (period.startingDate.format('YYYY') === period.endingDate.format('YYYY')) {
        if (period.startingDate.format('MM') === period.endingDate.format('MM')) {
          if (period.startingDate.format('DD') === period.endingDate.format('DD')) {
            return readingsParse(data, period, 'day');
          } else {
            return readingsParse(data, period, 'month');
          }
        } else {
          return readingsParse(data, period, 'year');
        }
      }
      // else {
      //   // for (let p = 0; ; p++) {
      //   //   deviceReadingsData = {
      //   //     periodFrom: '',
      //   //     periodTill: '',
      //   //     beginData: 0,
      //   //     endData: 0,
      //   //     consumption: 0
      //   //   }
      //     for (let i = 0; i < data.length; i++) {
      //       deviceReadingsData[deviceReadingsData.length] = {
      //         periodFrom: '',
      //         periodTill: '',
      //         beginData: 0,
      //         endData: 0,
      //         consumption: 0
      //       }
      //       if (!data[i - 1] || new Date(data[i - 1].time).getMonth() !== new Date(data[i].time).getMonth()) {
      //         deviceReadingsData[deviceReadingsData.length - 1].periodFrom = new Date(data[i].time).getMonth()
      //         deviceReadingsData[deviceReadingsData.length - 1].beginData = +data[i].value;
      //       }
      //       if (!data[i + 1]) {
      //         deviceReadingsData[deviceReadingsData.length - 1].endData = +data[i].value;
      //         deviceReadingsData[deviceReadingsData.length - 1].consumption = deviceReadingsData[deviceReadingsData.length - 1].endData - deviceReadingsData[deviceReadingsData.length - 1].beginData;
      //         break;
      //       } else if (new Date(data[i + 1].time).getMonth() !== new Date(data[i].time).getMonth()) {
      //         deviceReadingsData[deviceReadingsData.length - 1].endData = +data[i + 1].value;
      //         deviceReadingsData[deviceReadingsData.length - 1].consumption = deviceReadingsData[deviceReadingsData.length - 1].endData - deviceReadingsData[deviceReadingsData.length - 1].beginData;
      //         break;
      //       }
      //     }
      //   // }
      //   this.deviceReadingsData = this.valueCorrection(deviceReadingsData);
      // }
    }
  }
}

// export function readingsParse(data, period, type) {
//   const returnData = [];
//   const deviceReadingsData = [];
//   switch  (type) {
//     case 'day': {
//       for (let p = 0; p < 24; p++) {
//         deviceReadingsData[p] = {
//           periodFrom: p + ':00',
//           periodTill: '-' + (p + 1) + ':00',
//           beginData: 0,
//           endData: 0,
//           consumption: 0,
//           timeStamp: 0,
//           attached: {},
//         };
//         for (let i = 0; i < data.length; i++) {
//           if (new Date(data[i].time).getDate() ===
//             new Date(period.endingDate).getDate() &&
//             new Date(data[i].time).getHours() === p) {
//
//             if (!data[i - 1]) {
//               deviceReadingsData[p].beginData = +data[i].value;
//             } else if (new Date(data[i - 1].time).getHours() !== p) {
//               deviceReadingsData[p].beginData = +data[i - 1].value;
//             }
//             if (!data[i + 1]) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].timeStamp = data[i].time;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             } else if (new Date(data[i + 1].time).getHours() !== p) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].timeStamp = data[i].time;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             }
//           }
//         }
//       }
//       deviceReadingsData.forEach((item) => {
//         if (item.beginData !== 0 ||
//           item.endData !== 0 ||
//           item.consumption !== 0) {
//
//           returnData.push(item);
//         }
//       });
//       return returnData;
//     }
//     case 'month': {
//       for (let p = 0; p < 31; p++) {
//         deviceReadingsData[p] = {
//           periodFrom: p + 1,
//           periodTill: '',
//           beginData: 0,
//           endData: 0,
//           consumption: 0
//         };
//         for (let i = 0; i < data.length; i++) {
//           if (new Date(data[i].time).getMonth() ===
//             new Date(period.endingDate).getMonth() &&
//             new Date(data[i].time).getDate() === p + 1) {
//
//             if (!data[i - 1]) {
//               deviceReadingsData[p].beginData = +data[i].value;
//             } else if (new Date(data[i - 1].time).getDate() !== p + 1) {
//               deviceReadingsData[p].beginData = +data[i - 1].value;
//             }
//             if (!data[i + 1]) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             } else if (new Date(data[i + 1].time).getDate() !== p + 1) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             }
//           }
//         }
//       }
//       deviceReadingsData.forEach((item) => {
//         if (item.beginData !== 0 ||
//           item.endData !== 0 ||
//           item.consumption !== 0) {
//
//           returnData.push(item);
//         }
//       });
//       return returnData;
//     }
//     case 'year': {
//       for (let p = 0; p < 12; p++) {
//         deviceReadingsData[p] = {
//           periodFrom: p + 1 + '.' + new Date(period.endingDate).getFullYear(),
//           periodTill: '',
//           beginData: 0,
//           endData: 0,
//           consumption: 0
//         };
//         for (let i = 0; i < data.length; i++) {
//           if (new Date(data[i].time).getFullYear() ===
//             new Date(period.endingDate).getFullYear() &&
//             new Date(data[i].time).getMonth() === p) {
//
//             if (!data[i - 1]) {
//               deviceReadingsData[p].beginData = +data[i].value;
//             } else if (new Date(data[i - 1].time).getMonth() !== p) {
//               deviceReadingsData[p].beginData = +data[i - 1].value;
//             }
//             if (!data[i + 1]) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             } else if (new Date(data[i + 1].time).getMonth() !== p) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             }
//           }
//         }
//       }
//       deviceReadingsData.forEach((item) => {
//         if (item.beginData !== 0 ||
//           item.endData !== 0 ||
//           item.consumption !== 0) {
//
//           returnData.push(item);
//         }
//       });
//       return returnData;
//     }
//     case 'quarter': {
//       this.periodUnits = ', месяцы';
//       for (let p = 0; p < 12; p++) {
//         deviceReadingsData[p] = {
//           periodFrom: p + 1,
//           periodTill: '',
//           beginData: 0,
//           endData: 0,
//           consumption: 0
//         };
//         for (let i = 0; i < data.length; i++) {
//           if (new Date(data[i].time).getFullYear() ===
//             new Date(period.endingDate).getFullYear() &&
//             new Date(data[i].time).getMonth() === p) {
//
//             if (!data[i - 1] || new Date(data[i - 1].time).getMonth() !== p) {
//               deviceReadingsData[p].beginData = +data[i].value;
//             } else if (new Date(data[i - 1].time).getMonth() !== p) {
//               deviceReadingsData[p].beginData = +data[i - 1].value;
//             }
//             if (!data[i + 1]) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             } else if (new Date(data[i + 1].time).getMonth() !== p) {
//               deviceReadingsData[p].endData = +data[i].value;
//               deviceReadingsData[p].consumption = deviceReadingsData[p].endData - deviceReadingsData[p].beginData;
//               break;
//             }
//           }
//         }
//       }
//       deviceReadingsData.forEach((item) => {
//         if (item.beginData ||
//           item.endData ||
//           item.consumption ||
//           (item.periodFrom > new Date(period.endingDate).getMonth() - 2 &&
//             item.periodFrom <= new Date(period.endingDate).getMonth() + 1)) {
//
//           returnData.push(item);
//         }
//       });
//       return returnData;
//     }
//     case 'period': {
//       if (period.startingDate.format('YYYY') === period.endingDate.format('YYYY')) {
//         if (period.startingDate.format('MM') === period.endingDate.format('MM')) {
//           if (period.startingDate.format('DD') === period.endingDate.format('DD')) {
//             return readingsParse(data, period, 'day');
//           } else {
//             return readingsParse(data, period, 'month');
//           }
//         } else {
//           return readingsParse(data, period, 'year');
//         }
//       }
//       // else {
//       //   // for (let p = 0; ; p++) {
//       //   //   deviceReadingsData = {
//       //   //     periodFrom: '',
//       //   //     periodTill: '',
//       //   //     beginData: 0,
//       //   //     endData: 0,
//       //   //     consumption: 0
//       //   //   }
//       //     for (let i = 0; i < data.length; i++) {
//       //       deviceReadingsData[deviceReadingsData.length] = {
//       //         periodFrom: '',
//       //         periodTill: '',
//       //         beginData: 0,
//       //         endData: 0,
//       //         consumption: 0
//       //       }
//       //       if (!data[i - 1] || new Date(data[i - 1].time).getMonth() !== new Date(data[i].time).getMonth()) {
//       //         deviceReadingsData[deviceReadingsData.length - 1].periodFrom = new Date(data[i].time).getMonth()
//       //         deviceReadingsData[deviceReadingsData.length - 1].beginData = +data[i].value;
//       //       }
//       //       if (!data[i + 1]) {
//       //         deviceReadingsData[deviceReadingsData.length - 1].endData = +data[i].value;
//       //         deviceReadingsData[deviceReadingsData.length - 1].consumption = deviceReadingsData[deviceReadingsData.length - 1].endData - deviceReadingsData[deviceReadingsData.length - 1].beginData;
//       //         break;
//       //       } else if (new Date(data[i + 1].time).getMonth() !== new Date(data[i].time).getMonth()) {
//       //         deviceReadingsData[deviceReadingsData.length - 1].endData = +data[i + 1].value;
//       //         deviceReadingsData[deviceReadingsData.length - 1].consumption = deviceReadingsData[deviceReadingsData.length - 1].endData - deviceReadingsData[deviceReadingsData.length - 1].beginData;
//       //         break;
//       //       }
//       //     }
//       //   // }
//       //   this.deviceReadingsData = this.valueCorrection(deviceReadingsData);
//       // }
//     }
//   }
// }

export function valueCorrection(val, device_type) {
  switch (device_type) {
    case 10: {
      val.forEach((data) => {
        data.beginData = data.beginData / 1000;
        data.endData = data.endData / 1000;
        data.consumption = data.consumption / 1000;
      });
    }
      break;
  }
  return val;
}

export function periodUnits(period) {
  switch  (period.periodType) {
    case 'day':
      return ', часы';
    case 'month':
      return ', дни';
    case 'year':
      return '';
    case 'quarter':
      return ', месяцы';
    case 'period': {
      if (period.startingDate.format('YYYY') === period.endingDate.format('YYYY')) {
        if (period.startingDate.format('MM') === period.endingDate.format('MM')) {
          if (period.startingDate.format('DD') === period.endingDate.format('DD')) {
            return ', часы';
          } else {
            return ', дни';
          }
        } else {
          return '';
        }
      } else {
        return '';
      }
    }
  }
}

export function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

export function parseToSave(data, periodUnits, unit) {
  const fullArr = [
    [
      'Период' + periodUnits,
      'Начало' + unit,
      'Конец' + unit,
      'Расход' + unit
    ]
  ];
  for (let i = 0; i < data.length; i++) {
    const arr = [];
    arr.push(data[i].periodFrom + '' + data[i].periodTill);
    arr.push(data[i].beginData);
    arr.push(data[i].endData);
    arr.push(data[i].consumption);
    fullArr.push(arr);
  }
  return fullArr;
}

export function setUnits(val) {
  switch (val.device_type) {
    case 10: return 'кВт*ч';
    case 20: return 'м3';
    case 30: return 'м3';
    case 40: return 'м3';
    case 50: return 'кДж';
    default: return '';
  }
}
