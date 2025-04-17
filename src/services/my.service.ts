import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MyService {
  private apiUrl = 'http://192.168.1.2/angularcrud/api/inquiry/inquiry';
  private token = 'GRJFRIFM16VD45L6PSRTBQIN4AGT78YEWQ615GR34CVG338TYDZPWBFU4L78534FV75';

  constructor(private httpClient: HttpClient) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `User ${this.token}`
      })
    };
  }

  saveInquiryFormData(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `User ${this.token}` });
    return this.httpClient.post(`${this.apiUrl}/save`, formData, { headers });
  }

  getInquiriesData(id: string = ''): Observable<any> {
    const postData = id ? { id: id } : {};
    return this.httpClient.post(`${this.apiUrl}/list`, postData, this.getHeaders());
  }

  updateInquiryData(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/update`, data, this.getHeaders());
  }

  deleteInquiriesData(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/delete`, data, this.getHeaders());
  }

  generateCaptcha(): { question: string, answer: number } {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const answer = num1 + num2;
    const question = `${num1} + ${num2} = ?`;

    return { question, answer };
  }
}