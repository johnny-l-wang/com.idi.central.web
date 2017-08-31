import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { TdDialogService, TdLoadingService } from '@covalent/core';
import { TokenService, IUserProfile } from '../../../services';
import { Runtime, BaseComponent, Status } from '../../../core';

@Component({
    templateUrl: './lock-screen.component.html',
    styleUrls: ['lock-screen.component.css']
})
export class LockScreenComponent extends BaseComponent {

    profile: IUserProfile
    formControlPassword = new FormControl('', [Validators.required]);

    constructor(private token: TokenService,
        protected route: ActivatedRoute, protected router: Router, protected snack: MdSnackBar,
        protected loading: TdLoadingService, protected dialog: TdDialogService) {
        super(route, router, snack, loading, dialog)

        Runtime.instance.unauthorize()
        this.profile = JSON.parse(Runtime.instance.get("profile")) as IUserProfile
    }

    async unlock(): Promise<void> {
        let username: string = this.profile.username;
        let password: string = this.formControlPassword.value;

        this.load();

        this.token.apply(username, password).subscribe(result => {
            if (result.status == Status.Success) {
                this.navigate("/central")
            }
            else {
                this.alert(result.message)
            }
            this.unload();
        }, error => {
            this.handle(error);
            this.unload();
        });
    }
}