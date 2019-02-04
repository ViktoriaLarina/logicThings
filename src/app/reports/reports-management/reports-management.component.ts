import {AfterContentInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StoreService} from '../../store/store.service';
import {CoreAbonentsService} from '../../core-module/servises/core.abonents.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as reportsUtils from '../utils/reports-utils';

@Component({
  selector: 'app-reports-management',
  templateUrl: './reports-management.component.html',
  styleUrls: ['./reports-management.component.css']
})
export class ReportsManagementComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() filters: any;
  @Input() additionFilters: any;
  @Input() report: boolean;

  user: any;
  reportsList: any;
  interval: any;
  dataForSaving: any;

  constructor(private store: StoreService, private httpAbonService: CoreAbonentsService) {
    this.store.userEvent.subscribe((user) => {
      this.user = user;

    });
    this.reportsList = [];
    this.interval = null;
    this.store.createReportEvent.subscribe((event) => {
      if (event.message === 'done') {
        this.startInterval();
      }
    });
    this.user = this.store.user;
    this.dataForSaving = [];
  }

  ngOnInit() {
  }
  ngAfterContentInit() {
    this.startInterval();
  }
  startInterval() {
    this.interval = setInterval(() => this.getReportsList(), 1000);
  }
  stopInterval() {
    clearInterval(this.interval);
  }
  getReportsList() {
    this.httpAbonService.getReportsList(this.user.user_id)
      .subscribe((data: any) => {
        this.reportsList = data.reports;
      });
  }
  createReport() {
    alert('опция временно не доступна');
    // return;
    this.stopInterval();
    this.store.createReportEvent.next({message: 'create', data: this.user.user_id});
  }
  deleteReport(item) {
    this.stopInterval();
    const delReq = {
      report_id: item.report_id,
      action: ''
    };
    if (item.progress !== 100) {
     delReq.action = 'stop';
    } else {
      delReq.action = 'delete';
    }
    this.httpAbonService.deleteReport(delReq, this.user.user_id)
      .subscribe((success) => {
        this.startInterval();
      }, err => {
        this.startInterval();
      });
  }
  saveReport(item) {
    const saveReq = {
      report_id: item.report_id,
      action: 'load'
    };
    this.httpAbonService.saveReport(saveReq, this.user.user_id)
      .subscribe((success) => {
        const resp: any = success;
        this.dataForSaving = reportsUtils.reportDataProcessing(resp.reports);
        if (this.dataForSaving[0]) {
          reportsUtils.saveInFile(this.dataForSaving, resp.from, resp.till);
        }
      });
  }

  ngOnDestroy() {
    this.stopInterval();

  }
}
