import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {INodeModel, IUserDescription} from '../interfaces/allInterfaces';
import {StoreService} from '../store/store.service';
import {CoreAbonentsService} from '../core-module/servises/core.abonents.service';

@Component({
  selector: 'app-address-addition',
  templateUrl: './address-addition.component.html',
  styleUrls: ['./address-addition.component.css'],
})
export class AddressAdditionComponent implements OnInit {
  currentNode: INodeModel;
  newNode: any;
  newNodeValues: IUserDescription;
  private nodeStr: string;
  constructor(private store: StoreService, private abonentsService: CoreAbonentsService) {
    this.newNode = {
      node_id: '',
      parent_id: '',
      node_type: 0,
      name: '',
      description: ''
    };
    this.newNodeValues = {
      firstName: {name: '', id: '', node_id: ''},
      lastName: {name: '', id: '', node_id: ''},
      patronymic: {name: '', id: '', node_id: ''},
      country: {name: '', id: '', node_id: ''},
      city: {name: '', id: '', node_id: ''},
      houseNumber: {name: '', id: '', node_id: ''},
      entranceNumber: {name: '', id: '', node_id: ''},
      apartmentNumber: {name: '', id: '', node_id: ''},
      officeNumber: {name: '', id: '', node_id: ''},
      accountNumber: {name: '', id: '', node_id: ''},
      district: {name: '', id: '', node_id: ''},
      type: {name: '', id: '', node_id: ''},
      name: {name: '', id: '', node_id: ''},
      section: {name: '', id: '', node_id: ''},
    };
  }
  ngOnInit() {
    this.nodeStr = JSON.stringify(this.store.currentNode);
    this.currentNode = JSON.parse(this.nodeStr);
  }

  create() {
    this.newNode.parent_id = this.currentNode.node_id;
    this.newNode.node_type = Number(this.newNode.node_type);
    if (!this.newNode.node_type && (!this.currentNode.node_type || this.currentNode.node_type === 10)) {
      this.newNode.node_type = this.currentNode.node_type + 10;
    }
    // console.dir(this.newNode);
    this.abonentsService.createNode(this.newNode, this.store.findAndGetNode(this.currentNode.node_id))
      .subscribe((success) => {
        const nodeVals = this.nodeValueParse(this.newNodeValues, success);
        this.abonentsService.createNodeValues(nodeVals, success, this.store.findAndGetNode(this.currentNode.node_id)).subscribe(() => {});
        });
    this.close();
  }

  nodeValueParse(rawVals, node) {
    // console.log('address-addition comp nodeValueParse()');
    // console.dir(rawVals);
    // console.dir(node);
    const values = [];
    for (const key in rawVals) {
      if (rawVals.hasOwnProperty(key)) {
        // if (rawVals[key].name) {
          const value = {
            value_id: '',
            node_id: node.node_id,
            value_type: 0,
            value: rawVals[key].name
          };
          switch (key) {
            case 'country':
              value.value_type = 10;
              break;
            case 'city' :
              value.value_type = 20;
              break;
            case 'type' :
              value.value_type = 30;
              break;
            case 'name' :
              value.value_type = 31;
              break;
            case 'houseNumber' :
              value.value_type = 40;
              break;
            case 'section' :
              value.value_type = 33;
              break;
            case 'entranceNumber' :
              value.value_type = 50;
              break;
            case 'apartmentNumber' :
              value.value_type = 60;
              break;
            case 'officeNumber' :
              value.value_type = 70;
              break;
            case 'lastName' :
              value.value_type = 80;
              break;
            case 'firstName' :
              value.value_type = 90;
              break;
            case 'patronymic' :
              value.value_type = 100;
              break;
            case 'accountNumber' :
              value.value_type = 110;
              break;
            case 'district' :
              value.value_type = 21;
              break;
          }
          values.push(value);
        }
      // }
    }
    if (node.node_type === 10) {
      values.push({
        value_id: '',
        node_id: node.node_id,
        value_type: 1,
        value: node.name
      });
    }
    return values;
  }

  checkNode() {
    if (!this.newNode.node_type && (this.currentNode.node_type === 20 || this.currentNode.node_type === 30)) {
      return false;
    }
    return true;
  }

  close() {
    this.store.addressManagementEvent.next('close');
  }
}
