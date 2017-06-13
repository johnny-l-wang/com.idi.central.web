//Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Module
import { AppRoutingModule } from './app-routing.module';

//Component
import { AppRootComponent } from './components/app-root/app-root.component';
import { TopbarComponent } from './components/layout/topbar/topbar.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { SidebarRightComponent } from './components/layout/sidebar-right/sidebar-right.component';
import { FootbarComponent } from './components/layout/footbar/footbar.component';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppRootComponent,
    TopbarComponent,
    SidebarComponent,
    SidebarRightComponent,
    FootbarComponent,
    MenuComponent,
    DashboardComponent
  ],
  exports: [],//declarations 的子集，可用于其它模块的组件模板。
  imports: [BrowserModule, FormsModule, AppRoutingModule],//本模块声明的组件模板需要的类所在的其它模块
  providers: [],// 服务的创建者，并加入到全局服务列表中，可用于应用任何部分
  bootstrap: [AppRootComponent]//指定应用的主视图（称为根组件），它是所有其它视图的宿主。只有根模块才能设置bootstrap属性
})
export class AppModule { }
