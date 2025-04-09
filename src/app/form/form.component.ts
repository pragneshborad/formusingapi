import { Component } from '@angular/core';
import { MyService } from 'src/services/my.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  name: string = '';
  inquiry: string = '';
  email: string = '';
  contact: string = '';
  subject: string = '';
  comments: string = '';
  

  constructor(private myService: MyService) { }

  saveInquiryData() {
    if(!this.name || !this.inquiry || !this.email || !this.contact || !this.subject || !this.comments){
      alert("all Field is required");
      return;
    }

    const data = {
      name: this.name,
      inquiry_type: this.inquiry,
      email_address: this.email,
      contact_no: this.contact,
      subject: this.subject,
      comments: this.comments,
    };

    this.myService.saveInquiryData(data).subscribe(
      (response) => {
        console.log('Data saved successfully', response);
        alert("Data saved successfully");
      },
      (error) => {
        console.error('Error saving data', error);
        console.error('Error details:', error.error);
        
      }
    );
  }

}
