import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    const url = 'http://127.0.0.1:8000/products/';
    return this.http.get<any>(url);
  }

  getCustomersNumber(): Observable<any> {
    const url = `http://localhost:8000/customers/`;
    return this.http.get<any>(url);
  }

  getCustomers(): Observable<any> {
    const url = `http://localhost:8000/customers/customers_list/`;
    return this.http.get<any>(url);
  }


  getSalesPerYear(year: number): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk=${year}`;
    return this.http.get<any>(url);
  }

  getSalesPerMonthSalesFact(year: number, month: number): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk=${year}_${month}`;
    return this.http.get<any>(url);
  }

  getSalesForCity(city: any): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk_local=${city}`;
    return this.http.get<any>(url);
  }

  getSalesPerProduct(product: any): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk_product=${product}`;
    return this.http.get<any>(url);
  }

  getSalesPerTimeAndCity(year: any, month : any, city: any): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk=${year}_${month}&sk_local=${city}`;
    return this.http.get<any>(url);
  }

  getSalesPerTimeAndProduct(year: any, month : any, product: any): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk=${year}_${month}&sk_product=${product}`;
    return this.http.get<any>(url);
  }

  getSalesPerProductAndCity(product: any, city: any): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk_local=${city}&sk_product=${product}`;
    return this.http.get<any>(url);
  }

  getSalesPerProductAndCityAndTime(product: any, city: any, year: any, month: any): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/filter/?sk=${year}_${month}&sk_local=${city}&sk_product=${product}`;
    return this.http.get<any>(url);
  }

  getTotalSales(): Observable<any>{
    const url = `http://127.0.0.1:8000/salesFact/filter`;
    return this.http.get<any>(url);
  }

  getSalesPerMonth(): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/net-total-by-month/`;
    return this.http.get<any>(url);
  }



  getAllSalesForCity(): Observable<any> {
    const url = `http://127.0.0.1:8000/salesFact/net-total-for-city/`;
    return this.http.get<any>(url);
  }

  getForeignPercentage(): Observable<any> {
    const url = `http://127.0.0.1:8000/invoices/percSalesForeign/2023`;
    return this.http.get<any>(url);
  }


  //sem uso
  getProductByID(id: string): Observable<any> {
    const url = `http://127.0.0.1:8000/products/${id}/`;
    return this.http.get<any>(url);
  }


}
