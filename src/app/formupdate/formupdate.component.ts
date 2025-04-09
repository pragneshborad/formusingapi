import { Component } from '@angular/core';
import { MyService } from 'src/services/my.service';

@Component({
  selector: 'app-formupdate',
  templateUrl: './formupdate.component.html',
  styleUrls: ['./formupdate.component.css']
})
export class FormupdateComponent {

  id: string = '';
  name: string = '';
  inquiry: string = '';
  email: string = '';
  contact: string = '';
  subject: string = '';
  comments: string = '';
  inquiries: any[] = [];

  constructor(private myService: MyService) { }
  
  updateInquiryData() {
    if (!this.id) {
      alert("ID is required for update");
      return;
    }
    const data = {
      id: this.id,
      name: this.name,
      inquiry_type: this.inquiry,
      email_address: this.email,
      contact_no: this.contact,
      subject: this.subject,
      comments: this.comments,

    };

    this.myService.updateInquiryData(data).subscribe(
      Response => {
        console.log('updated Response', Response);
        alert(Response.message);
        this.inquiries;
      });
  }
}

