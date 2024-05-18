import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Listing} from "../model/Listing";

@Component({
  selector: 'app-rent-dialog',
  templateUrl: './rent-dialog.component.html',
  styleUrl: './rent-dialog.component.css'
})
export class RentDialogComponent implements OnInit {
  rentForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<RentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { listing: Listing },
    private fb: FormBuilder
  ) {
    this.rentForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      duration: ['1 week'],
      car: ['']
    });
  }

  ngOnInit(): void {
    this.rentForm.get('duration')?.valueChanges.subscribe(value => {
      if (value === 'indefinite') {
        this.rentForm.get('endDate')?.disable();
        this.rentForm.get('endDate')?.setValue(null);
      } else {
        this.rentForm.get('endDate')?.enable();
      }
    });

    // Add logic to disable dates
  }

  onConfirm(): void {
    if (this.rentForm.valid) {
      this.dialogRef.close(this.rentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
