import {Component, OnInit} from '@angular/core';
import {PaymentService} from "../service/PaymentService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-reject',
  templateUrl: './payment-reject.component.html',
  styleUrl: './payment-reject.component.css'
})
export class PaymentRejectComponent implements OnInit {
  constructor(private readonly paymentService: PaymentService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.paymentService.notifyRejectedPayment().subscribe(
      ()=>{
        this.router.navigate(['/'])

      }
    )


  }
}
