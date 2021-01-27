import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {IUser} from "../entities/user";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiServiceService} from "../api-service.service";

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  private unsubscribe: Subject<void> = new Subject<void>();
  public formGroupCreation: FormGroup;
  private isUpdate: boolean = false;
  public action: string = 'Create';

  constructor(
    private apiService: ApiServiceService,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser) {
  }

  ngOnInit(): void {
    this.isUpdate = !!this.data;
    !!this.data ? this.action = 'Update' : 'Create';
    this.initForm();
  }

  onCreateUser() {
    if (this.formGroupCreation.valid) {
      let user = this.formGroupCreation.value as IUser;
      if (this.isUpdate) {
        this.update(user);
      } else {
        this.apiService.create(user)
          .subscribe(value => this.dialogRef.close());
      }
    }
  }

  private update(user: IUser) {
    this.data.birthday = user.birthday;
    this.data.lastname = user.lastname;
    this.data.salary = user.salary;
    this.data.function = user.function;
    this.data.experiences = user.experiences;
    this.apiService.update(this.data)
      .subscribe(value => this.dialogRef.close())
  }

  private initForm() {
    this.formGroupCreation = new FormGroup({
      lastname: new FormControl(this.isUpdate ? this.data.lastname : '', [Validators.required]),
      function: new FormControl(this.isUpdate ? this.data.function : '', [Validators.required]),
      experience: new FormControl(this.isUpdate ? this.data.experiences : '', [Validators.required]),
      address: new FormControl(this.isUpdate ? this.data.address : '', [Validators.required]),
      salary: new FormControl(this.isUpdate ? this.data.salary : '', [Validators.required]),
      birthday: new FormControl(this.isUpdate ? this.data.birthday : '', [Validators.required]),
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
