import {Injectable} from '@angular/core';
import {AbonentsService} from '../../communication-module/services/abonents.service';
import {Observable} from 'rxjs/Observable';
import {AsyncLocalStorage} from 'angular-async-local-storage';
import {StoreService} from '../../store/store.service';
import * as moment from 'moment';
import 'rxjs/add/operator/switchMap';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Injectable()
export class CoreAbonentsService {
  constructor(private abonentsService: AbonentsService,
              private store: StoreService,
              private localStorage: AsyncLocalStorage) {
  }

  getDataForReport(data) {
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.getDataForReport(data, key)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success);
                    observer.complete();
                  }
                });
          });
      }
    );
  }

  getDeviceStates(nodeId, deviceId) {
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.getDeviceStates(nodeId, deviceId, key)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success);
                    observer.complete();
                  }
                });
          });
      }
    );
  }

  getDeviceSamples(nodeId, deviceId, params) {
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.getDeviceSamples(nodeId, deviceId, key, params)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success);
                    observer.complete();
                  }
                });
          });
      }
    );
  }

  getNextFilter(data) {
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.getNextFilter(data, key)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success.data);
                    observer.complete();
                  }
                });
          });
      }
    );
  }

  getSearchFilters(client, district?, deviceType?, sector?) {
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.getFilters(key, client, district, deviceType, sector)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success.data);
                    observer.complete();
                  }
                });
          });
      }
    );
  }

  getNextCriterion(data) {
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.getNextCriterion(data, key)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success.data);
                    observer.complete();
                  }
                });
          });
      }
    );
  }
  getDeviceReadingsData(node, device, param) {
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.getDeviceReadingsData(node, key, device, param)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success);
                    observer.complete();
                  }
                });
          });
      });
  }
  getNodes(client?: any): any  {
      const nodeReq = {api_key: '', parent_id: ''};
      if (client === undefined) {
        nodeReq.parent_id = '';
      } else {
        nodeReq.parent_id = client.node_id;
      }
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          nodeReq.api_key = key;
          this.abonentsService.getNodes(nodeReq).subscribe(
            (success) => {
              // console.log('core abonservice getNodes');
              // console.dir(success);
              if (nodeReq.parent_id) {
                if (!success.nodes || success.nodes.length === 0) {
                  client.noChilds = true;
                }
                client.child = success.nodes;
                client.isWaiting = false;
              } else {
                this.store.setRootNode(success.nodes);
              }
            }
          );
        }
      );
  }
  searchNodes(searchData, client): Observable<any> {
    return new Observable((observer) => {
      let page = 1;
      let validSearchData = searchData;
      const perPage = 30;

      if (this.store.searchCollection[client.node_id] && !searchData && this.store.searchCollection[client.node_id].perPage !== 99999) {
        page = this.store.searchCollection[client.node_id].page + 1;
        validSearchData = this.store.searchCollection[client.node_id].searchData;
      } else if (searchData) {
        // if (searchData === '*') { // TODO: if need to load all results uncomment this
        //   client.child = [];
        //   perPage = 99999;
        // } else {
        //   client.child = [];
        // }
        client.child = [];  // TODO: if need to load all results comment this
      } else {
        observer.next(true);
        return;
      }
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.searchNodes(validSearchData, key, client, page, perPage).subscribe(
            (success) => {
              // console.dir(success);

              if (success.total > success.page * 30) {
                this.store.searchCollection[client.node_id] = {
                  searchData: validSearchData,
                  page: success.page,
                  perPage: success.perPage,
                  total: success.total
                };
              } else if (this.store.searchCollection[client.node_id]) {
                delete this.store.searchCollection[client.node_id];
              }
              if (!success.nodes || success.nodes.length === 0) {
                client.noChilds = true;
              } else {
                success.nodes.forEach((node) => {
                  client.child.push(node);
                });
              }
              observer.next(success);
            },
            (error: any) => observer.error(error)
          );
        }
      );
    });
  }
  saveNode(node, parrentNode) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.saveNode(node, key).subscribe(
            (success) => {
              if (parrentNode.node_id !== '') {
                this.store.delCurrentNodeChild();
                this.getNodes(parrentNode);
                this.getNodeValues(parrentNode);
                this.getNodeDevices(parrentNode);
                this.store.setCurrentNode(parrentNode);
              } else {
                this.store.cleanStore();
                this.getNodes();
              }
              observer.next(true);
            }
          );
        }
      );
    });
  }
  deleteNode(node, parrentNode) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.deleteNode(node, key).subscribe(
          (success) => {
            if (parrentNode.node_id !== '') {
              this.store.delCurrentNodeChild();
              this.getNodes(parrentNode);
              this.getNodeValues(parrentNode);
              this.getNodeDevices(parrentNode);
              this.store.setCurrentNode(parrentNode);
            } else {
              this.store.cleanStore();
              this.getNodes();
            }
          }
        );
      }
    );
  }
  createNode(node, parrentNode) {
    // console.log('core abon service createNode()');
    // console.dir(node);
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.createNode(node, key).subscribe(
            (success) => {
              if (parrentNode.node_id !== '') {
                this.store.delCurrentNodeChild();
                this.getNodes(parrentNode);
                this.getNodeValues(parrentNode);
                this.getNodeDevices(parrentNode);
                this.store.setCurrentNode(parrentNode);
              } else {
                this.store.cleanStore();
                this.getNodes();
              }
              observer.next(success.nodes[0]);
            }
          );
        }
      );
    });
  }
  getNodeValues(client) {
    const nodeReq = {api_key: '', node_id: ''};
    nodeReq.node_id = client.node_id;
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        nodeReq.api_key = key;
        this.abonentsService.getNodeValues(nodeReq).subscribe(
          (success) => {
            // console.log('core abonservice getNodeValues()');
            // console.log(success);
            this.store.setNodeValues(success.values);
          }
        );
      }
    );
  }
  saveValues(vals, node, parrentNode) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.saveValues(vals, key, node).subscribe(
            (success) => {
              if (parrentNode.node_id !== '') {
                this.store.delCurrentNodeChild();
                this.getNodes(parrentNode);
                this.getNodeValues(parrentNode);
                this.getNodeDevices(parrentNode);
                this.store.setCurrentNode(parrentNode);
              } else {
                this.store.cleanStore();
                this.getNodes();
              }
              observer.next(true);
            }
          );
        }
      );
    });
  }
  createNodeValues(vals, node, parrentNode) {
    // console.log('createNodeValues');
    // console.dir(vals);
    // console.dir(node);
    // console.dir(parrentNode);
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.createValues(vals, key, node).subscribe(
            (success) => {
              // console.log('core abons createValues() success');
              // console.dir(success);
              this.store.delCurrentNodeChild();
              this.getNodes(parrentNode);
              this.getNodeValues(parrentNode);
              this.getNodeDevices(parrentNode);
              this.store.setCurrentNode(parrentNode);
              observer.next(true);
            }
          );
        }
      );
    });
  }
  getNodeDevices(client, parrentNode?) {
    const nodeReq = {api_key: '', node_id: ''};
    nodeReq.node_id = client.node_id;
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        nodeReq.api_key = key;
        this.abonentsService.getNodeDevices(nodeReq).subscribe(
          (success) => {

            // Filter devices if client has filter of deviceType
            if (parrentNode) {
              const type = parrentNode.selectedFilters.deviceType;
              if (type) {
                success.devices = success.devices.filter( i => {
                  if (type.key) {
                    return i.device_type === parrentNode.selectedFilters.deviceType.key;
                  } else {
                    return i;
                  }
                });
              }
            }

            success.devices.forEach(item => {
              this.abonentsService.getDeviceState(item.device_id, client.node_id, key).subscribe(data => {
                if (data.device_states.length > 0 && data.device_states[data.device_states.length - 1].device_id) {
                  item.devState = data.device_states.sort(function (a, b) {
                    if (moment(a.time) > moment(b.time)) {
                      return 1;
                    }
                    if (moment(a.time).millisecond() < moment(b.time).millisecond()) {
                      return -1;
                    }
                    });
                } else {
                  item.devState = [{
                    device_state_id: '',
                    device_id: '',
                    comment: '',
                    time: '',
                    value: ''
                  }];
                }
              });
            });
            this.store.setCurrentNodeDevices(success.devices);
          }
        );
      }
    );
  }
  createDevice(dev, node, parrentNode) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.createDevice(dev, key, node).subscribe(
            (success) => {
              this.store.delCurrentNodeChild();
              this.getNodes(parrentNode);
              this.getNodeValues(parrentNode);
              this.getNodeDevices(parrentNode);
              this.store.setCurrentNode(parrentNode);
              observer.next(success.devices[0]);
            });
        });
    });
  }
  saveDevice(dev, node, parrentNode) {
    if (dev['devState']) {
      delete dev.devState;
    }
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.saveDevice(dev, key, node).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(parrentNode);
            this.getNodeValues(parrentNode);
            this.getNodeDevices(parrentNode);
            this.store.setCurrentNode(parrentNode);
          });
      });
  }
  deleteDevice(dev, node, parrentNode) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.deleteDevice(dev, key, node).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(parrentNode);
            this.getNodeValues(parrentNode);
            this.getNodeDevices(parrentNode);
            this.store.setCurrentNode(parrentNode);
          });
      });
  }
  getDeviceValues(device, node) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.getDeviceValues(device, node, key).subscribe(success => {
          this.store.setDeviceValues(success.device_values);
        });
      }
    );
  }
  createDeviceValue(device, node, parrentNode, vals) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.createDeviceValue(device, node, key, vals).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(parrentNode);
            this.getNodeValues(parrentNode);
            this.getNodeDevices(parrentNode);
            this.store.setCurrentNode(parrentNode);
          }
        );
      }
    );
  }
  saveDeviceValue(device, node, parrentNode, vals) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.saveDeviceValue(device, node, key, vals).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(parrentNode);
            this.getNodeValues(parrentNode);
            this.getNodeDevices(parrentNode);
            this.store.setCurrentNode(parrentNode);
          }
        );
      }
    );
  }
  saveDeviceState(device, node, parrentNode, stat) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.saveDeviceState(device, node, key, stat).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(parrentNode);
            this.getNodeValues(parrentNode);
            this.getNodeDevices(parrentNode);
            this.store.setCurrentNode(parrentNode);
          }
        );
      }
    );
  }


  getUser() {
    this.localStorage.getItem('userId')
      .subscribe((id) => {
        this.localStorage.getItem('API_KEY')
          .subscribe((key) => {
            this.abonentsService.getUser(id, key).subscribe(
              (success) => {
                this.store.setUser(success);
              });
          });
      });
  }

  getAuthor(id: string) {
    return this.localStorage.getItem('API_KEY')
      .switchMap((key) => {
        return this.abonentsService.getUser(id, key);
      });
  }

  createReadings(node, device, item) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.createReadings(node, key, device, item).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(node);
            this.getNodeValues(node);
            this.getNodeDevices(node);
            this.store.setCurrentNode(node);
          });
      });
  }
  saveReadings(node, device, item) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.saveReadings(node, key, device, item).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(node);
            this.getNodeValues(node);
            this.getNodeDevices(node);
            this.store.setCurrentNode(node);
          });
      });
  }
  deleteReadings(node, device, item) {
    this.localStorage.getItem('API_KEY').subscribe(
      (key) => {
        this.abonentsService.deleteReadings(node, key, device, item).subscribe(
          (success) => {
            this.store.delCurrentNodeChild();
            this.getNodes(node);
            this.getNodeValues(node);
            this.getNodeDevices(node);
            this.store.setCurrentNode(node);
          });
      });
  }
  getPhotoForReadings(node_id, device_id, data_id) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.getPhotoForReadings(node_id, device_id, data_id, key).subscribe(
            (success) => {

              observer.next(success);
            }, (err: any) => observer.error(err));

        });
    });
  }
  getReportsList(user_id) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.getReportsList(user_id, key).subscribe(
            (success) => {

              observer.next(success);
            }, (err: any) => observer.error(err));

        });
    });
  }
  requestForReportMake(data, user_id) {
    data.status = 'started';
    data.progress = 0;
    data.action = 'start';
    return new Observable(
      (observer) => {
        this.localStorage.getItem('API_KEY').subscribe(
          (key) => {
            this.abonentsService.requestForReportMake(data, user_id, key)
              .subscribe(
                (success) => {
                  if (success) {
                    observer.next(success);
                    observer.complete();
                  }
                });
          });
      }
    );
  }
  saveReport(data, user_id) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.reportActions(data, user_id, key).subscribe(
            (success) => {

              observer.next(success);
            }, (err: any) => observer.error(err));

        });
    });
  }
  deleteReport(data, user_id) {
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.reportActions(data, user_id, key).subscribe(
            (success) => {

              observer.next(success);
            }, (err: any) => observer.error(err));

        });
    });
  }

  getAssignedUsers(currentNodeId: string) {
    // console.dir('core abon serv getAssignedUsers()');
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.getAssignedUsers(currentNodeId, key).subscribe(
            (success) => {

              observer.next(success.user_access_data);
            }, (err: any) => observer.error(err));

        });
    });
  }

  getAllUsers() {
    // console.dir('core abon serv getAllUsers()');
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.getAllUsers(key).subscribe(
            (success) => {

              observer.next(success.data);
            }, (err: any) => observer.error(err));

        });
    });
  }

  assignNewUser(dataForAssign: any) {
    // console.dir('core abon serv assignNewUser()');
    // console.dir(dataForAssign);
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.assignNewUser(dataForAssign, key).subscribe(
            (success) => {
              // console.log(success);
              observer.next(success.data);
            },
            (err: any) => observer.error(err));
        });
    });
  }

  changeUserAssigningAccess(dataForUpdateAssign: any) {
    // console.dir('core abon serv changeUserAssigningAccess()');
    // console.dir(dataForUpdateAssign);
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.changeUserAssigningAccess(dataForUpdateAssign, key).subscribe(
            (success) => {
              // console.log(success);
              observer.next(success.data);
            },
            (err: any) => observer.error(err));
        });
    });
  }

  deleteUserAssigning(dataForDeleteAssign: any) {
    // console.dir('core abon serv deleteUserAssigning()');
    // console.dir(dataForDeleteAssign);
    return new Observable((observer) => {
      this.localStorage.getItem('API_KEY').subscribe(
        (key) => {
          this.abonentsService.deleteUserAssigning(dataForDeleteAssign, key).subscribe(
            (success) => {
              observer.next(success.data);
            },
            (err: any) => observer.error(err));
        });
    });
  }
}
