import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  public products = [
    {"id" : 1 , "name":"computer" ,"price":1000},
    {"id" : 1 , "name":"computer" ,"price":1000},
    {"id" : 1 , "name":"computer" ,"price":1000},
    {"id" : 1 , "name":"computer" ,"price":1000}
  ]; 


constructor(){}


ngOnInit(): void {
  
}
}
