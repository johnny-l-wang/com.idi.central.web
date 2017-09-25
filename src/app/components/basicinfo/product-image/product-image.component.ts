import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { TdDialogService, TdLoadingService, TdFileService, IUploadOptions } from '@covalent/core';
import { ProductService, ProductImageService, CategoryService, IProduct, IProductImage, TypeNames } from '../../../services';
import { BaseComponent, PageHeader, Command, Status, Regex, PictureCategory } from '../../../core';
import 'rxjs/add/operator/toPromise';

@Component({
    templateUrl: './product-image.component.html',
    styleUrls: ['product-image.component.css']
})
export class ProductImageComponent extends BaseComponent implements OnInit {

    header: PageHeader
    mode: Command
    pid: string
    editable: boolean = false
    files: Array<File> = []
    categorys: any[]
    current: IProduct = { id: '', name: '', code: '', tags: [], images: [], active: false, onshelf: false }

    constructor(private product: ProductService, private productImage: ProductImageService, private category: CategoryService,
        protected route: ActivatedRoute, protected router: Router, protected snack: MdSnackBar,
        protected loading: TdLoadingService, protected dialog: TdDialogService) {
        super(route, router, snack, loading, dialog)
    }

    ngOnInit(): void {
        this.header = new PageHeader('Product', ['Basic Info', 'Product', 'Image'])
        this.pid = this.getParam('id')

        this.initUI();
        this.filter();
    }

    async initUI(): Promise<void> {

        this.load();

        try {
            this.categorys = await this.category.all(TypeNames.ImageCategory).toPromise()
        }
        catch (error) {
            this.handle(error)
        }
        finally {
            this.unload()
        }
    }

    async filter(): Promise<void> {
        this.load();

        try {
            this.current = await this.product.single(this.pid).toPromise()
            this.header.title = this.current.name
        }
        catch (error) {
            this.handle(error)
        }
        finally {
            this.unload()
        }
    }

    edit(): void {
        this.files = []
        this.editable = true
    }

    cancel(): void {
        this.editable = false
    }

    hasImages(): boolean {
        return this.current.images.length > 0
    }

    drop(index: number): void {
        let files: Array<File> = []
        for (var i = 0; i < this.files.length; i++) {
            if (index != i) {
                files.push(this.files[i])
            }

        }
        this.files = files
    }

    delete(id: string): void {
        this.confirm('Are you confirm to delete this record?', (accepted) => {
            if (accepted) {
                this.handleDelete(id)
            }
        })
    }

    async handleDelete(id: string): Promise<void> {
        this.load();
        try {
            let result = await this.productImage.remove(id).toPromise()

            if (result.status == Status.Success) {
                let index = this.current.images.findIndex(image => image.id == id)
                this.current.images.splice(index, 1)
                this.show('Product image(s) updated.')
            }
            else {
                this.alert(result.message)
            }
        }
        catch (error) {
            this.handle(error)
        }
        finally {
            this.unload()
        }
    }

    async save(): Promise<void> {
        this.load();
        try {
            let result = await this.productImage.batch(this.current.id, this.current.images).toPromise()

            if (result.status == Status.Success) {
                this.editable = false
                this.show('Product image(s) updated.')
            }
            else {
                this.alert(result.message)
            }
        }
        catch (error) {
            this.handle(error)
        }
        finally {
            this.unload()
            this.filter();
        }
    }

    valid(): boolean {
        if (this.files.length == 0)
            return false

        for (var index = 0; index < this.files.length; index++) {
            var file = this.files[index]
            if (file.size / 1024 > 800)
                return false
        }

        return true;
    }

    async upload(): Promise<void> {

        if (!this.valid())
            return;

        this.load();

        try {
            let result = await this.productImage.add(this.current.id, this.files).toPromise()

            if (result.status == Status.Success) {
                this.show('Product image(s) uploaded.');
                this.filter();
            }
            else {
                this.alert(result.message)
            }
        }
        catch (error) {
            this.handle(error)
        }
        finally {
            this.files = []
            this.unload()
        }
    }

    back(): void {
        this.navigate('central/product/list')
    }

    categorydesc(category: PictureCategory): string {
        switch (category) {
            case PictureCategory.Cover:
                return 'COVER'
            case PictureCategory.Picture:
                return 'PIC'
            case PictureCategory.Advertisement:
                return 'AD'
            default:
                return ''
        }
    }
}