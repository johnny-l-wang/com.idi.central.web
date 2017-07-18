import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

//Components
import { LoginComponent } from './components/pages/login/login.component';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { LockScreenComponent } from './components/pages/lock-screen/lock-screen.component';
import { MainComponent } from './components/pages/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoleListComponent } from './components/roles/role-list.component';
import { UserListComponent } from './components/users/user-list.component';

const routes: Route[] = [
    { path: '', redirectTo: "/login", pathMatch: "full" },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'lock-screen', component: LockScreenComponent },
    {
        path: 'central', component: MainComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'role/list', component: RoleListComponent },
            { path: 'user/list', component: UserListComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}