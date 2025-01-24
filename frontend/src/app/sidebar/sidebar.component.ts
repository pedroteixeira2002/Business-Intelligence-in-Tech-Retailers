import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewService } from '../view.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  view: string = "dashboard";

  constructor(private viewService: ViewService) {
  }

  changeView(view: string): void {
    this.view = view;
    console.log("View sidemenu: ", this.view)
    this.viewService.setView(view);
  }

}
