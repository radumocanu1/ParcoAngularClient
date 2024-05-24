import {Component, OnInit} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {PaymentService} from "../service/PaymentService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private readonly paymentService: PaymentService,
              private router: Router) {}
  ngOnInit(): void {
    this.paymentService.notifySuccessPayment().subscribe(
      () =>
        this.router.navigate(['/payment-success'])
    )
  }

}
