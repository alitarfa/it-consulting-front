import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DialogFormComponent} from "../dialog-form/dialog-form.component";
import {IUser} from "../entities/user";
import {ApiServiceService} from "../api-service.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['lastname', 'function', 'experiences', 'address', 'salary', 'birthday', "action"];
  dataSource = new MatTableDataSource<IUser>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedValue: string = 'function';
  public filterList: string [] = ['lastname', 'function', 'address', 'birthday'];

  constructor(private dialogCreation: MatDialog,
              private apiService: ApiServiceService) {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.apiService.updating.subscribe(value => {
      if (value) this.onFetchData();
    })
    this.onFetchData();
  }

  private onFetchData() {
    this.apiService.find(0, 10).subscribe(response => {
      this.dataSource.data = response.body;
    });
  }

  onOpenDialog(element?: IUser) {
    let matDialogRef = this.dialogCreation.open(DialogFormComponent, !!element ? {data: element} : {data: null});
  }

  onApplyFilter() {
    this.apiService.applyFilter(this.selectedValue)
      .subscribe(value => {
        this.dataSource.data = value.body;
      })
  }

  onDelete(element: any) {
    this.apiService.delete(element.id).subscribe();
  }

  resetAll() {
    this.onFetchData();
  }
}
