import { Component } from '@angular/core';
import { MyService } from 'src/services/my.service';

@Component({
  selector: 'app-formdelete',
  templateUrl: './formdelete.component.html',
  styleUrls: ['./formdelete.component.css']
})
export class FormdeleteComponent {

  id: string = '';
  inquiries: any[] = [];

  constructor(private myService: MyService) { }

  deleteInquiriesData() {
    if (!this.id) {
      alert("ID is Required");
      return;
    }

    this.myService.deleteInquiriesData({ id: this.id }).subscribe(response => {
      console.log('Delete Response:', response);
      alert(response.message);
      this.inquiries;
    });
  }
}
