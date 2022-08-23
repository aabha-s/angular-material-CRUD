import { Component, OnInit } from '@angular/core';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from './services/api.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'newCrudProject';
  displayedColumns: string[] = [
    'productName',
    'category',
    'price',
    'comment',
    'freshness',
    'date',
    'action',
    'birthday'
  ];
  dataSource!: MatTableDataSource<any>;
  birthday = new Date(2000, 6, 10);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog, private apiservice: ApiService) {}
  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: '50%',
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'save') {
          this.getAllProducts();
        }
      });
  }

  getAllProducts() {
    this.apiservice.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error while fetching the data!!!');
      },
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editProduct(row: any) {
    this.dialog
      .open(DialogComponent, {
        width: '40%',
        data: row,
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllProducts();
        }
      });
  }

  deleteProduct(id: number) {
    this.apiservice.deleteProduct(id).subscribe({
      next: (res) => {
        alert('Product deleted successfulyy!!!');
        this.getAllProducts();
      },
      error: (res) => {
        alert('Something went erong!!!');
      },
    });
  }
}
