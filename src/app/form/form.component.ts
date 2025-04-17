import { Component, OnInit } from '@angular/core';
import { MyService } from 'src/services/my.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  name: string = '';
  inquiry: string = '';
  email: string = '';
  contact: string = '';
  subject: string = '';
  addresses: { addr: string }[] = [{ addr: '' }];
  resumefile: File | null = null;

  captchaQuestion: string = '';
  captchaAnswer: number = 0;
  userAnswer: number | undefined;

  constructor(private myService: MyService) { }

  ngOnInit(): void {
    this.generateCaptcha(); 
  }


  generateCaptcha(): void {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1; 
    this.captchaAnswer = num1 + num2;
    this.captchaQuestion = `${num1} + ${num2} = ?`; 
    this.userAnswer = undefined;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.resumefile = input.files[0];
      if (this.resumefile.type !== 'application/pdf') {
        alert('Only PDF files are accepted');
      }
    }
  }

  addAddressField() {
    this.addresses.push({ addr: '' });
  }

  removeAddressField(index: number) {
    if (this.addresses.length > 1) {
      this.addresses.splice(index, 1);
    }
  }

  saveInquiryData() {
    if (!this.name || !this.inquiry || !this.email || !this.contact || !this.subject || 
        !this.addresses.every(address => address.addr.trim() !== '') || !this.resumefile) {
      alert("All fields are required.");
      return;
    }


    if (this.userAnswer !== this.captchaAnswer) {
      alert('Incorrect CAPTCHA answer. Please try again.');
      this.generateCaptcha(); 
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('inquiry_type', this.inquiry);
    formData.append('email_address', this.email);
    formData.append('contact_no', this.contact);
    formData.append('subject', this.subject);

    this.addresses.forEach(data => {
      formData.append('address[]', data.addr);
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
