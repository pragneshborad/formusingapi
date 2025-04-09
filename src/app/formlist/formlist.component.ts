import { Component } from '@angular/core';
import { MyService } from 'src/services/my.service';

@Component({
  selector: 'app-formlist',
  templateUrl: './formlist.component.html',
  styleUrls: ['./formlist.component.css']
})
export class FormlistComponent {

  id: string = '';

  inquiries: any[] = [];

  constructor(private myService: MyService) { }


  getInquiriesData() {
    this.myService.getInquiriesData().subscribe(response => {
      if (response.success == 1) {
        this.inquiries = response.data;
      } else {
        this.inquiries = [];
        alert(response.message);
      }
    });
  }
  getInquiriesById() {
    if (this.id) {
      this.myService.getInquiriesById(this.id).subscribe(response => {
        if (response.success == 1) {
          this.inquiries = response.data;
        } else {
          this.inquiries = [];
          alert(response.message);
        }
      });
    } else {
      alert('please enter an ID');
    }
  }
}