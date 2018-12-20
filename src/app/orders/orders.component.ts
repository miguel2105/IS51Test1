import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlexModalService } from '../shared-components/flex-modal/flex-modal.service';
import { Http } from '@angular/http';
import { checkAndUpdatePureExpressionDynamic } from '@angular/core/src/view/pure_expression';
import { _appIdRandomProviderFactory } from '@angular/core/src/application_tokens';
import { stringify } from 'querystring';

export interface IOrder {
  pid?: string;
  description?: string;
  price?: number;
  quantity?: number;
  image?: string;
}
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {

  orders: Array<IOrder> = [];
  errorMessage: string = '';
  confirmMessage: string = '';
  name: string = '';

  constructor(
    private router: Router,
    private flexModal: FlexModalService,
    private http: Http
  ) { }

  async ngOnInit() {

  }

  loadOrders() {
    this.orders = [{
      "pid": "1",
      "image": "assets/sm_android.jpeg",
      "description": "Android",
      "price": 150.00,
      "quantity": 2
    }, {
      "pid": "2",
      "image": "assets/sm_iphone.jpeg",
      "description": "IPhone",
      "price": 200.00,
      "quantity": 1
    }, {
      "pid": "3",
      "image": "assets/sm_windows.jpeg",
      "description": "Windows Phone",
      "price": 110.00,
      "quantity": 2
    }];
  }

  removeItem(index: number) {
    this.orders.splice(index, 1);
  }

  addItem(item: string) {
    switch (item) {
      case 'Android':
        this.orders.unshift({
          "pid": "1",
          "image": "assets/sm_android.jpeg",
          "description": "Android",
          "price": 150.00,
          "quantity": 1
        });
        break;
      case 'IPhone':
        this.orders.unshift({
          "pid": "2",
          "image": "assets/sm_iphone.jpeg",
          "description": "IPhone",
          "price": 200.00,
          "quantity": 1
        });
        break;
      case 'Windows':
        this.orders.unshift({
          "pid": "3",
          "image": "assets/sm_windows.jpeg",
          "description": "Windows Phone",
          "price": 110.00,
          "quantity": 1
        });
        break;
    }
  }

  clear() {
    // this.orders[0].pid = null;
    // this.orders[0].description = null;
    // this.orders[0].price = null;
    // this.orders[0].quantity = null;

    // this.orders[1].pid = null;
    // this.orders[1].description = null;
    // this.orders[1].price = null;
    // this.orders[1].quantity = null;

    // this.orders[2].pid = null;
    // this.orders[2].description = null;
    // this.orders[2].price = null;
    // this.orders[2].quantity = null;
    for (let i = 0; i < this.orders.length; i++) {
      console.log(this.orders[i]);
      Object.keys(this.orders[i]).forEach((item: any) => {
        console.log('item', item);
        if (item != 'image') {
          console.log('this.orders[i][item]', this.orders[i][item]);
          this.orders[i][item] = null;
        }
      });
    }

  }
  validate(name: string, total: number, taxAmount: number, subTotal: number) {
    if (!total) {
      this.errorMessage = 'Must execute calculation!';
      this.showMessage('error-modal');
    }
    if (name == '') {
      this.errorMessage = 'Name must not be empty!';
    } else if (name.indexOf(', ') == -1) {
      this.errorMessage = 'Name must have a comma and a space!';
    }
    if (this.errorMessage.length > 0) {
      return false;
    } else {
      return true;
    }


  }
  showMessage(modalID: string) {
    this.flexModal.openDialog(modalID);
  }
  //calculate total and perform input validation
  calculateTotal() 
  {
    const subTotal = this.orders.reduce((acc: number, item: IOrder) => {
      acc += item.quantity * item.price;
      return acc;
    }, 0);
    const taxAmount = subTotal * 0.1;
    const total = subTotal + taxAmount;
    const validated = this.validate(this.name, total, taxAmount, subTotal);
    if (!validated) {
      this.showMessage('error-modal');
    } else {
      this.confirmMessage = this.setSuccessMessage(this.name, total, taxAmount, subTotal);
      this.showMessage('confirm-modal');
    }


  }

  setSuccessMessage(name: string, total: number, taxAmount: number, subTotal: number) {
    let output = '';
    // Mendoza, Miguel
    const commaIndex = name.indexOf(', ');
    const firstName = name.slice(commaIndex, name.length);
    const lastName = name.slice(0, commaIndex + 1);
    output = `Thank you for your order ${firstName} ${lastName}
  Your subtotal is: ${subTotal}, your tax amount is: ${taxAmount}, and your grand total is: ${total}.`;
    return output;
  }

}


