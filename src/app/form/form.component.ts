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
  addresses: string[] = [''];

  resumefile: File | null = null;

  constructor(private myService: MyService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.resumefile = input.files[0];
    }
  }

  addAddressField() {
    this.addresses.push('');
  }

  removeAddressField(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.splice(index, 1);
    }
  }

  saveInquiryData() {
    if (!this.name || !this.inquiry || !this.email || !this.contact || !this.subject || !this.addresses || !this.resumefile) {
      alert("All fields including multiple addresses and resume are required.");
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('inquiry_type', this.inquiry);
    formData.append('email_address', this.email);
    formData.append('contact_no', this.contact);
    formData.append('subject', this.subject);

    this.addresses.forEach(addr => {
      formData.append('address[]', addr);
    });

    formData.append('resume', this.resumefile);

    this.myService.saveInquiryFormData(formData).subscribe(
      (response) => {
        console.log('Data saved successfully', response);
        alert("Data saved successfully!");
      },
      (error) => {
        console.error('Error saving data', error);
        alert("An error occurred while saving data.");
      }
    );
  }
}