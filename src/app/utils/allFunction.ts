export function deleteDeviceAttentionFilters() {
  localStorage.removeItem('managementCompany');
  localStorage.removeItem('district');
  localStorage.removeItem('sector');
  localStorage.removeItem('deviceType');
  localStorage.removeItem('sortType');
  localStorage.removeItem('sortField');
  localStorage.removeItem('status');
}

export function deleteReportsFilters() {
  localStorage.removeItem('managmentCompanyReports');
  localStorage.removeItem('districtReports');
  localStorage.removeItem('sectorReports');
  localStorage.removeItem('deviceTypeReports');
  localStorage.removeItem('startDateReports');
  localStorage.removeItem('endDateReports');
}


export function trySaveFilter(key: string, value: any) {
  if (value) {
    localStorage.setItem(key, value.toString());
  }
}
