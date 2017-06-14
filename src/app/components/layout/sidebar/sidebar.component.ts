import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../models/menu';

declare var $: any;

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    ngOnInit(): void {
        $(function () {
            // NAVIGATION HIGHLIGHT & OPEN PARENT
            $("#sidebar-menu ul li.has_sub a.active").parents("li:last").children("a:first").addClass("active").trigger("click");

            var ua = navigator.userAgent, event = (ua.match(/iP/i)) ? "touchstart" : "click";

            $("#sidebar-menu a").on(event, function (e) {
                if (!$("#wrapper").hasClass("enlarged")) {
                    if ($(this).parent().hasClass("has_sub")) {

                    }
                    if (!$(this).hasClass("subdrop")) {
                        // hide any open menus and remove all other classes
                        $("ul", $(this).parents("ul:first")).slideUp(350);
                        $("a", $(this).parents("ul:first")).removeClass("subdrop");
                        $("#sidebar-menu .pull-right i").removeClass("md-remove").addClass("md-add");

                        // open our new menu and add the open class
                        $(this).next("ul").slideDown(350);
                        $(this).addClass("subdrop");
                        $(".pull-right i", $(this).parents(".has_sub:last")).removeClass("md-add").addClass("md-remove");
                        $(".pull-right i", $(this).siblings("ul")).removeClass("md-remove").addClass("md-add");
                    } else if ($(this).hasClass("subdrop")) {
                        $(this).removeClass("subdrop");
                        $(this).next("ul").slideUp(350);
                        $(".pull-right i", $(this).parent()).removeClass("md-remove").addClass("md-add");
                    }
                }
            });
        });
    }
    // menus: Menu[] = [
    //     { name: "Dashboard", action: "dashboard", actived: true },
    //     { name: "menu-2", action: "action-2", actived: false },
    //     { name: "menu-3", action: "action-3", actived: false },
    //     { name: "menu-4", action: "action-4", actived: false }
    // ];

    // selectedMenu: Menu;

    // onSelected(item: Menu): void {
    //     this.selectedMenu = item;
    // };
}