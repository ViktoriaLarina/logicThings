import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import {StoreService} from '../store/store.service';
import {INodeModel, IUserDescription} from '../interfaces/allInterfaces';
import {CoreAbonentsService} from '../core-module/servises/core.abonents.service';

@Component({
  selector: 'app-address-edit',
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.css'],
})
export class AddressEditComponent implements OnInit {
  currentNode: INodeModel;
  currentNodeValues: IUserDescription;
  private nodeStr: string;
  private valueStr: string;
  constructor(private store: StoreService, private abonentsService: CoreAbonentsService) {
  }
  ngOnInit() {
    this.nodeStr = JSON.stringify(this.store.currentNode);
    this.currentNode = JSON.parse(this.nodeStr);
    this.valueStr = JSON.stringify(this.store.currentNodeValues);
    this.currentNodeValues = JSON.parse(this.valueStr);
  }
  save() {
    if (this.nodeStr !== JSON.stringify(this.currentNode)) {
      delete this.currentNode.child;
      this.abonentsService.saveNode(this.currentNode, this.store.findAndGetNode(this.currentNode.parent_id))
        .subscribe((success) => {
          if (this.valueStr !== JSON.stringify(this.currentNodeValues)) {
            const nodeVals = this.nodeValueParse(this.currentNodeValues, this.currentNode);
            this.abonentsService.saveValues(nodeVals, this.currentNode, this.store.findAndGetNode(this.currentNode.parent_id))
              .subscribe(() => {});
          }
        });
    } else if (this.valueStr !== JSON.stringify(this.currentNodeValues)) {
      const nodeVals = this.nodeValueParse(this.currentNodeValues, this.currentNode);
      this.abonentsService.saveValues(nodeVals, this.currentNode, this.store.findAndGetNode(this.currentNode.parent_id))
        .subscribe(() => {});
    }
    this.close();
  }
  close() {
    this.store.addressManagementEvent.next('close');
  }
  nodeValueParse(rawVals, node) {
    const values = [];
    for (const key in rawVals) {
      if (rawVals.hasOwnProperty(key)) {
        if (rawVals[key].node_id === this.currentNode.node_id) {
          const value = {
            value_id: rawVals[key].id,
            node_id: rawVals[key].node_id,
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
      }
    }
    return values;
  }
}
