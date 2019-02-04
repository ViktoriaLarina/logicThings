import { Input, OnInit, Component, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import {CoreAbonentsService} from '../core-module/servises/core.abonents.service';
import {StoreService} from '../store/store.service';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { MatDialog, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-client-nodes',
  templateUrl: './clientsNodes.component.html',
  styleUrls: ['./clientsNodes.component.css']
})
export class ClientsNodesComponent implements OnInit {
  @Input() address: string[];
  @Output() onSearchFired = new EventEmitter<any>();
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  addresses: any;
  activeNode: any;
  shownNodes: any;
  total: any;
  private dialogRef: MatDialogRef<any>;

  constructor(
    private abonentsService: CoreAbonentsService,
    private store: StoreService,
    private dialog: MatDialog
  ) {
    this.store.currentNodeEvent.subscribe((data) => {
      this.activeNode = data;
      this.refreshNodeStatus(data);
    });
    this.total = {};
    this.shownNodes = {};
    this.addresses = {
      clients: [{
        value: '',
        name: '',
        node_id: '10',
        parent_id: '',
        node_type: '',
        description: '',
        child: [{
          value: '',
          name: '',
          node_id: '20',
          parent_id: '10',
          node_type: '',
          description: '',
          child: [{
            value: '',
            name: '',
            node_id: '30',
            parent_id: '20',
            node_type: '',
            description: '',
            flats: [{
              value: '',
              name: '',
              node_id: '40',
              parent_id: '30',
              node_type: '',
              description: '',
            }],
            offices: [{
              value: '',
              name: '',
              node_id: '50',
              parent_id: '30',
              node_type: '',
              description: '',
            }]
          }],
        }],
      }],
    };
  }

  ngOnInit() {
    this.addresses = this.store.getRootNode();
    if (!this.addresses.clients.length) {
      this.store.cleanStore();
      this.abonentsService.getNodes();
    }
  }

  getNode(client, $event, parrentNode?) {
    $event.stopPropagation();
    if (client.node_type === 10) {
      // console.log('node_type === 10');
      this.abonentsService.getNodeValues(client);
      this.abonentsService.getNodeDevices(client);
      this.store.setCurrentNode(client);
      client.isWaiting = false;
    } else {
      this.refreshNodeStatus(client);
      this.abonentsService.getNodes(client);
      this.abonentsService.getNodeValues(client);
      this.abonentsService.getNodeDevices(client, parrentNode);
      this.store.setCurrentNode(client);
    }
    // Get all filters if there is no one
    if (!client.filters && client.node_type === 10) {
      // Create filters property
      this.abonentsService.getSearchFilters(client)
        .subscribe(r => {
          // Create filters
          client.filters = {};
          client.selectedFilters = {};
          client.filters.districts = r;

          // Get search params
          this.getSearchParams(client);
        });
    }
  }

  pickIcon(node) {
    switch (node.node_type) {
      case 10: return 'management-company-icon';
      case 20: return 'building-icon';
      case 30: return 'entrance-icon';
      case 40: return 'flat-icon';
      case 50: return 'office-icon';
    }
  }

  refreshNodeStatus(node) {
    node.noChilds = false;
    node.isWaiting = true;
  }

  toggleNode(node) {
    // node.expanded === true ? node.expanded = false : node.expanded = true;
    node.expanded = !node.expanded;
  }

  openDialog(templateRef: TemplateRef<any>, client) {
    this.dialogRef = this.dialog.open(templateRef);
  }

  closeDialog(client, district, deviceType, sector) {
    this.dialog.closeAll();
    if (client) {
      // Set selected district
      client.selectedFilters.district = district.triggerValue;
      // set selected device type
      client.selectedFilters.deviceType = {};
      client.selectedFilters.deviceType.key = deviceType.value;
      client.selectedFilters.deviceType.name = deviceType.triggerValue;
      // Set sector
      client.selectedFilters.sector = {};
      client.selectedFilters.sector.key = sector.value;
      client.selectedFilters.sector.name = sector.triggerValue;

      // Save params
      this.saveSearchParams(client);
    }
  }

  getCurrentSector(client, district, device_type, sectorSelect) {
    // Clear old data
    client.filters.sectors = null;
    sectorSelect.value = '';
    if (device_type !== '*') {
      // Get all districts
      this.abonentsService.getSearchFilters(client, district, device_type)
        .subscribe(r => {
          client.filters.sectors = r;
        });
    }
  }

  search(client, $event) {
    client.invalidRequest = false;
    const inputValue: any = document.getElementById('searchInput' + client.node_id);
    if (inputValue.value) {
      // this.usersStore
      client.searchValue = inputValue.value;
      // Save params
      this.saveSearchParams(client);
      this.shownNodes[client.node_id] = [];
      this.refreshNodeStatus(client);
      this.abonentsService.searchNodes(inputValue.value, client).subscribe((data) => {
        this.abonentsService.getNodeValues(client);
        this.abonentsService.getNodeDevices(client);
        this.store.setCurrentNode(client);
        this.shownNodes[client.node_id] = data.nodes;
        this.total[client.node_id] = {total: data.total};
        const parent: any = document.getElementById('abonent-node' + client.node_id);
        this.onSearchFired.emit(parent.offsetTop);
        this.directiveRef.scrollToTop(0, 0);
        client.isWaiting = false;
      },
        (error) => {
          this.total[client.node_id] = {total: 0};
          client.isWaiting = false;
          client.invalidRequest = true;
        });
    }
  }

  saveSearchParams(node: any) {
    let params = {
      searchValue: '',
      selectedFilters: {}
    };
    params.searchValue = node.searchValue;
    params.selectedFilters = node.selectedFilters;
    this.store.setSearchParams(node.node_id, params);
  }

  getSearchParams(node: any) {
    const newParams = this.store.getSearchParams(node.node_id);
    if (Object.keys(newParams)) {
      node.searchValue = newParams.searchValue ? newParams.searchValue : '';
      node.selectedFilters = newParams.selectedFilters ? newParams.selectedFilters : {};
    } else {
      node.searchValue = '';
    }
  }

  onScrollUp(event, client) {
    if (this.shownNodes[client.node_id].length > 28) {
      // let indexOfNode = -1;
      // client.child.forEach((node, index) => {
      //   if (node.node_id === this.shownNodes[client.node_id][0].node_id) {
      //     indexOfNode = index;
      //   }
      // });
      const indexOfNode = client.child.indexOf(this.shownNodes[client.node_id][0]);
      // client.child.slice(indexOfNode - 20, indexOfNode).reverse().forEach((data) => {
      //   this.shownNodes[client.node_id].unshift(data);
      // });
      let prevNodes = [];
      if (indexOfNode === 0) {
        return;
      }
      if (indexOfNode > 20) {
        prevNodes = client.child.slice(indexOfNode - 20, indexOfNode);
      } else {
        prevNodes = client.child.slice(0, indexOfNode);
      }
      this.shownNodes[client.node_id] = prevNodes.concat(this.shownNodes[client.node_id]);
      if (indexOfNode > 19) {
        this.shownNodes[client.node_id]
          .splice(this.shownNodes[client.node_id].length - 20, 20);
        // this.shownNodes[client.node_id].reverse().splice(0, 20);
        // this.shownNodes[client.node_id].reverse();
      } else {
        this.shownNodes[client.node_id]
          .splice(this.shownNodes[client.node_id].length - indexOfNode, indexOfNode);
      }
      this.directiveRef.scrollToTop(event, 0);
    }
  }

  onScroll(event: number, client: any): void {
    // if (client.child.length < this.total[client.node_id].total) {
      this.abonentsService.searchNodes(null, client).subscribe((success) => {
        this.downScrollNodesMove(event, client);
      });
    // } else {
    //   this.downScrollNodesMove(event, client);
    // }
  }

  private downScrollNodesMove(event: number, client: any): void {
    if (this.shownNodes[client.node_id].length > 28) {
      // let indexOfNode = -1;
      let sliceUpEdge = -1;
      const childNodesLength = client.child.length;
      // client.child.forEach((node, index) => {
      //   if (node.node_id === this.shownNodes[client.node_id][this.shownNodes[client.node_id].length - 1].node_id) {
      //     indexOfNode = index;
      //   }
      // });
      const indexOfNode = client.child
        .indexOf(this.shownNodes[client.node_id][this.shownNodes[client.node_id].length - 1]);
      if (indexOfNode === this.total[client.node_id].total - 1) {
        return;
      }
      if (indexOfNode + 21 <= childNodesLength) {
        sliceUpEdge = indexOfNode + 21;
      } else {
        sliceUpEdge = childNodesLength;
      }
      client.child.slice(indexOfNode + 1, sliceUpEdge).forEach((data) => {
        this.shownNodes[client.node_id].push(data);
      });
      if (sliceUpEdge < childNodesLength) {
        this.shownNodes[client.node_id].splice(0, 20);
      } else {
        this.shownNodes[client.node_id].splice(0, childNodesLength - indexOfNode - 1);
      }
      this.directiveRef.scrollToTop(event, 0);
    }
  }
}
