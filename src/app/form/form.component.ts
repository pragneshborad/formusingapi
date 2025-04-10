import { Routes } from '@angular/router';
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

  resumefile: File  | null = null;
  

  constructor(private myService: MyService) { }

    onFileSelected(event: Event){
      const input = event.target as HTMLInputElement;
      if(input.files && input.files.length){
        this.resumefile = input.files[0];
      }
    }

  saveInquiryData() {
  if (!this.name || !this.inquiry || !this.email || !this.contact || !this.subject || !this.comments || !this.resumefile) {
    alert("All fields are required");
    return;
  }

  const formData = new FormData();
  formData.append('name', this.name);
  formData.append('inquiry_type', this.inquiry);
  formData.append('email_address', this.email);
  formData.append('contact_no', this.contact);
  formData.append('subject', this.subject);
  formData.append('comments', this.comments);
  formData.append('resume', this.resumefile); 

  this.myService.saveInquiryFormData(formData).subscribe(
    (response) => {
      console.log('Data saved successfully', response);
      alert("Data saved successfully");
    },
    (error) => {
      console.error('Error saving data', error);
      alert("Error occurred while saving data");
    }
  );
}

}
