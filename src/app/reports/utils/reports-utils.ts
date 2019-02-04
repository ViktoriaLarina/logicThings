import * as moment from 'moment';
// import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';
import * as XlsxPopulate from 'xlsx-populate/lib/XlsxPopulate';

export function reportValueParse(rawVals) {
  const values = [];
  switch (rawVals.deviceType) {
    case 10 : {
      for (const key in rawVals) {
        if (rawVals.hasOwnProperty(key)) {
          if (key !== 'deviceType') {
            const value = {
              // device_value_id: '',
              // device_id: '',
              device_value_type: 0,
              device_value: rawVals[key].name
            };
            switch (key) {
              case 'loadCharacteristics':
                value.device_value_type = 101;
                break;
              case 'accuracyClass' :
                value.device_value_type = 102;
                break;
              case 'energyType' :
                value.device_value_type = 103;
                break;
              case 'phaseQuantity' :
                value.device_value_type = 104;
                break;
              case 'transformationCoefficient' :
                value.device_value_type = 105;
                break;
              case 'decimal' :
                value.device_value_type = 106;
                break;
              case 'deploymentPlace' :
                value.device_value_type = 107;
                break;
              case 'entranceQuantity' :
                value.device_value_type = 108;
                break;
            }
            if (rawVals[key].name) {
              values.push(value);
            }
          }
        }
      }
    }
      break;
  }
  return values;
}

export function reportDataProcessing(data) {
  const dataForReport = data.map(
    (item) => {
      item.device.last_state_time = moment(item.device.last_state_time).format('DD.MM.YYYY HH:mm:ss');
      item.device.device_type = deviceTypes(item.device.device_type);
      const reportRow: any = {
        district: {value: item.location_district},
        location: {value: item.location_type},
        loc_name: {value: item.location_name},
        building_section: {value: item.location_section},
        building: {value: item.location_number},
        entrance: {value: item.location_entrance},
        appartment: {value: item.location_flat_number},
        office: {value: item.location_office_number},
        device: item.device,
        loadCharacteristics: {value: ''},
        accuracyClass: {value: ''},
        energyType: {value: ''},
        phaseQuantity: {value: ''},
        transformationCoefficient: {value: ''},
        decimal: {value: ''},
        deploymentPlace: {value: ''},
        entranceQuantity: {value: ''},
        time_before: item.time_before ? moment(item.time_before).format('DD.MM.YYYY HH:mm:ss') : '',
        time_now: item.time_now ? moment(item.time_now).format('DD.MM.YYYY HH:mm:ss') : '',
        signs_amount: item.device.signs_amount,
        consumer_type: item.device.consumer_type
      };
      reportRow.value_before = tokilos(item.value_before);
      reportRow.value_now = tokilos(item.value_now);
      if (reportRow.value_now) {
        reportRow.differ = Math.round((reportRow.value_now - reportRow.value_before) * 1000) / 1000;
      } else {
        reportRow.differ = 0;
      }
      if (item.device_values && item.device_values.length) {
        for (let i = 0; i < item.device_values.length; i++) {
          switch (item.device_values[i].value_type) {
            case 101:
              reportRow.loadCharacteristics = item.device_values[i];
              break;
            case 102:
              reportRow.accuracyClass = item.device_values[i];
              break;
            case 103:
              reportRow.energyType = item.device_values[i];
              break;
            case 104:
              reportRow.phaseQuantity = item.device_values[i];
              break;
            case 105:
              reportRow.transformationCoefficient = item.device_values[i];
              break;
            case 106:
              reportRow.decimal = item.device_values[i];
              break;
            case 107:
              reportRow.deploymentPlace = item.device_values[i];
              break;
            case 108:
              reportRow.entranceQuantity = item.device_values[i];
              break;
          }
        }
      }
      if (reportRow.transformationCoefficient.value) {
        reportRow.pointValue = reportRow.differ * reportRow.transformationCoefficient.value;
      } else {
        reportRow.pointValue = reportRow.differ;
      }
      return reportRow;
    }
  );
  return dataForReport;
}

export function tokilos(value) {
  if (value) {
     const kiloUnits = Number(value) / 1000;
     return kiloUnits;
  } else {
    return '';
  }
}

export function deviceTypes(value) {
  if (value) {
    let deviceTypeName;
    switch (value) {
      case 10:
        deviceTypeName = {
          key: 10,
          value: 'Электричество'
        };
        break;
      case 20:
        deviceTypeName = {
          key: 20,
          value: 'Вода холодная'
        };
        break;
      case 30:
        deviceTypeName = {
          key: 30,
          value: 'Вода горячая'
        };
        break;
      case 40:
        deviceTypeName = {
          key: 40,
          value: 'Газ'
        };
        break;
      case 50:
        deviceTypeName = {
          key: 50,
          value: 'Тепло'
        };
        break;
    }
    return deviceTypeName;
  }
}

export function saveInFile(dataForFile, from, till) {
  const arr = parseToSave(dataForFile, from, till);
  const districts = dataForFile.map(r => r.district.value).filter((c, index, array) => array.indexOf(c) === index);
  XlsxPopulate.fromBlankAsync()
    .then(workbook => {
      workbook.sheet('Sheet1').cell('A12').value(arr);
      const sheet = workbook.sheet(0);
      const left = {
        fontFamily: 'TimesNewRoman',
        fontSize: '10',
        horizontalAlignment: 'left'
      };
      const heading = {
        fontSize: '18',
        bold: true,
        fontFamily: 'TimesNewRoman',
        horizontalAlignment: 'center'
      };
      sheet.usedRange().style({
        border: true,
        fontFamily: 'TimesNewRoman',
        fontSize: '10',
        horizontalAlignment: 'center'
      });
      sheet.cell('M2').value('Дополнение №9').style(left);
      sheet.cell('M3').value('к договору о поставке электроэнергии').style(left);
      sheet.cell('M4').value('№  01 – 1670,1 от " 21 " июня 2007 г.').style(left);
      sheet.cell('H7').value('Отчет по электроэнергии за период с ' +
        moment(from).format('DD.MM.YYYY') + ' по ' +
        moment(till).format('DD.MM.YYYY')).style(heading);
      sheet.cell('H8').value('КП «Жилкомсервис»').style(heading);
      sheet.cell('H9').value(districts.length > 1 ? 'Все филиалы' : districts[0] + ' филиал').style(heading);
      sheet.column('Q').width(2).style({
        border: false
      });
      workbook.outputAsync()
        .then(function (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.href = url;
          a.download = 'LoThingsMeterReport.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        });
    });
}

// export function saveInFile(dataForFile, from, till) {
//   // if (dataForSaving[0]) {
//     const arr = parseToSave(dataForFile, from, till);
//     // const table = document.getElementById('rep-table');
//     // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
//     const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arr);
//     const wb: XLSX.WorkBook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//     const wbout: string = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});
//     FileSaver.saveAs(new Blob([s2ab(wbout)]), 'LoThingsMeterReport.xlsx');
//   // }
// }

export function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF;
  }
  return buf;
}

export function parseToSave(data, from, till) {
  const units = setUnits(data);
  const districts = data.map(r => r.district.value).filter((c, index, array) => array.indexOf(c) === index);
  const row1 = [], row2 = [], row3 = [], row4 = [], row5 = [], row6 = [];
  row1[12] = 'Дополнение №9';
  row2[12] = 'к договору о поставке электроэнергии';
  row3[12] = '№  01 – 1670,1 от " 21 " июня 2007 г.';
  row4[7] = 'Отчет по электроэнергии за период с ' +
    moment(from).format('DD.MM.YYYY') + ' по ' +
    moment(till).format('DD.MM.YYYY');
  row5[7] = 'КП «Жилкомсервис»';
  row6[7] = districts.length > 1 ? 'Все филиалы' : districts[0] + ' филиал';
  const colNames = [
    '№ п/п',
    '№ лицевого счета',
    'Адрес',
    '№ дома',
    '№ участка',
    'Тип прибора учета',
    'Тип потр',
    '№ счетчика',
    'Значность',
    'Изм. ПА',
    'Изм. Пар',
    'Текущие показания',
    'Предыдущие показания',
    'Разница',
    'Коэф',
    'Расход по точке (' + units + ')',
    '',
    'Превыш. или эконом.',
    'Расход прошлого месяца',
    'Расход позапрошлого месяца',
  ];
  const colNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, '', 17, 18, 19];
  // const fullArr = [[]];
  const fullArr = [];
  // fullArr.push(row1, row2, row3, [], [], row4, row5, row6, [], [], colNames, colNums);
  fullArr.push(colNames, colNums);
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].transformationCoefficient.value);
    // console.log(data[i].differ);
    // console.log(data[i].pointValue);
    // console.log(data[i].value_1period_previous);
    // console.log(data[i].value_2period_previous);
    const delta = data[i].pointValue - (+data[i].value_1period_previous + data[i].value_2period_previous) / 2;
    const arr = [];
    arr.push(i + 1);
    arr.push(data[i].device.bill_number);
    // arr.push(data[i].town.value);
    // arr.push(data[i].district.value);
    arr.push(data[i].location.value + ' ' + data[i].loc_name.value);
    arr.push(data[i].building.value);
    // arr.push(data[i].building_section.value);
    // arr.push(data[i].device.device_type);
    arr.push(data[i].device.sector);
    arr.push(data[i].device.name);
    arr.push(data[i].loadCharacteristics.value);
    arr.push(data[i].device.serial_number);
    arr.push(data[i].decimal.value);
    arr.push(data[i].energyType.value);
    arr.push(data[i].energyType.value);
    arr.push(data[i].value_till);
    arr.push(data[i].value_from);
    arr.push(data[i].differ);
    arr.push(data[i].transformationCoefficient.value);
    arr.push(data[i].pointValue);
    arr.push(' ');
    arr.push(Math.round(delta * 1000) / 1000);
    arr.push(data[i].value_1period_previous);
    arr.push(data[i].value_2period_previous);
    //   arr.push(data[i].device.bill_number);
    //   arr.push(data[i].device.agreement_number);
    // arr.push(data[i].device.service_company);
    // arr.push(data[i].device.foreman);
    // arr.push(data[i].device.worker);
    // arr.push(data[i].device.last_state);
    // arr.push(data[i].device.last_state_time);
    // arr.push(data[i].value_from);
    // arr.push(data[i].time_from);
    // arr.push(data[i].value_till);
    // arr.push(data[i].time_till);
    // arr.push(data[i].differ);
    // arr.push(data[i].transformationCoefficient.value);
    // arr.push(data[i].pointValue);
    // arr.push(data[i].value_1period_previous);
    // arr.push(data[i].value_2period_previous);
    // arr.push(data[i].value_3period_previous);
    // arr.push(data[i].loadCharacteristics.value);
    // arr.push(data[i].accuracyClass.value);
    // arr.push(data[i].energyType.value);
    // arr.push(data[i].phaseQuantity.value);
    // arr.push(data[i].decimal.value);
    // arr.push(data[i].deploymentPlace.value);
    // arr.push(data[i].entranceQuantity.value);
    fullArr.push(arr);
  }
  return fullArr;
}

export function setUnits(data) {
  switch (data[0].device.device_type) {
    case 10: return 'кВт*ч';
    case 'Электричество': return 'кВт*ч';
    default: return '';
  }
}
