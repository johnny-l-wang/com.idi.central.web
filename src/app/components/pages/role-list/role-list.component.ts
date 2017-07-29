import { Component, OnInit } from '@angular/core';
import { PageHeader } from '../../../models/page-header';
import { ActivatedRoute, Router } from '@angular/router';
import { TdDialogService, TdLoadingService, IPageChangeEvent, TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn } from '@covalent/core';
import { RoleService, IRoleRow } from '../../../services';
import 'rxjs/add/operator/toPromise';

@Component({
    templateUrl: './role-list.component.html',
})
export class RoleListComponent implements OnInit {

    header: PageHeader = new PageHeader("Roles", ["Administration", "Roles"]);

    data: IRoleRow[] = [];

    columns: ITdDataTableColumn[] = [
        { name: 'name', label: 'Name', filter: true },
        { name: 'descrition', label: 'Descrition' },
        { name: 'active', label: 'Active?', filter: true },
    ];

    filteredData: any[] = this.data;
    filteredTotal: number = this.data.length;
    searchTerm: string = '';
    fromRow: number = 1;
    currentPage: number = 1;
    pageSize: number = 5;
    sortBy: string = 'name';
    selectedRows: any[] = [];
    sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

    constructor(private role: RoleService, private router: Router, private route: ActivatedRoute,
        private loading: TdLoadingService, private dialog: TdDialogService, private dataTable: TdDataTableService
    ) { }

    ngOnInit(): void {
        this.filter();
    }

    async filter(): Promise<void> {
        try {
            this.loading.register('role-list');
            this.data = await this.role.all().toPromise()
        }
        catch (error) {
            this.data = [];
            this.dialog.openAlert({ message: error });
        }
        finally {
            this.loading.resolve('role-list');
        }

        let newData: IRoleRow[] = this.data;

        let excludedColumns: string[] = this.columns
            .filter((column: ITdDataTableColumn) => {
                return ((column.filter === undefined && column.hidden === true) || (column.filter !== undefined && column.filter === false));
            }).map((column: ITdDataTableColumn) => {
                return column.name;
            });

        newData = this.dataTable.filterData(newData, this.searchTerm, true, excludedColumns);
        this.filteredTotal = newData.length;
        newData = this.dataTable.sortData(newData, this.sortBy, this.sortOrder);
        newData = this.dataTable.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
        this.filteredData = newData;
    }

    sort(sortEvent: ITdDataTableSortChangeEvent): void {
        this.sortBy = sortEvent.name;
        this.sortOrder = sortEvent.order;
        this.filter();
    }

    search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.filter();
    }

    page(pagingEvent: IPageChangeEvent): void {
        this.fromRow = pagingEvent.fromRow;
        this.currentPage = pagingEvent.page;
        this.pageSize = pagingEvent.pageSize;
        this.filter();
    }
}