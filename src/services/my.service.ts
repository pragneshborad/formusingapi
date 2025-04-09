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

  saveInquiryData(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/save`, data, this.getHeaders());
  }

  getInquiriesData(): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/list`, {}, this.getHeaders());
  }

  getInquiriesById(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}/inquiries/${id}`, this.getHeaders());
  }

  updateInquiryData(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/update`, data, this.getHeaders());
  }

  deleteInquiriesData(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/delete`, data, this.getHeaders());
  }
}