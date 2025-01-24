import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../api.service';
import { ViewService } from '../view.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  view: string = "";
  numCustomers: any;
  totalByMonth: any;

  inputYear: number = 2023;
  inputMonth: number = 1;
  time_netTotal: any;
  year_netTotal: any


  //Todas as Vendas por mês
  public salesPerMonth_Options: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Total de Vendas por mês'
      }
    }
  };
  public salesPerMonth_Type: ChartType = 'line';
  public salesPerMonth_Data: ChartConfiguration['data'] = { labels: [], datasets: [{data:[], label: "Vendas"}] };



  public salesForCity_Options: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Total de Vendas por Cidade'
      }
    }
  };
  public salesForCity_Type: ChartType = 'line';
  public salesForCity_Data: ChartConfiguration['data'] = { labels: [], datasets: [{data:[], label: "Vendas"}]};



  constructor(private apiservice: ApiS2ervice, private viewService: ViewService) {
  }


  ngOnInit(): void {

    /*
    this.viewService.view$.subscribe(view => {
      this.view = view;
      console.log("View updated: ", this.view);
    });
    */

    //Pedidos das KPI's
    this.getNetValuePerYearAndMonth_sk(this.inputYear, this.inputMonth);
    this.getNetValuePerYear_sk(this.input_PerYear);
    this.getSalesForCity_sk(this.selectedCity);
    this.getSalesForProduct_sk(this.selectedProduct);
    this.getSalesForTimeAndCity_sk(this.timeCity_year_selected, this.timeCity_month_selected, this.timeCity_city_selected);
    this.getSalesForTimeAndProduct_sk(this.timeProduct_year_selected, this.timeProduct_month_selected, this.timeProduct_product_selected);
    this.getSalesForProductAndCity_sk(this.cityProduct_product_selected, this.cityProduct_city_selected);
    this.getSalesForProductAndCityAndTime_sk(this.cityProductTime_product_selected, this.cityProductTime_city_selected, this.cityProductTime_year_selected, this.cityProductTime_month_selected)
    this.getMostSaleProduct();


    //Gráficos
    this.getSalesByMonth();
    this.getSalesForCity();

    this.loadDashboard();
  }


  // Dashboard

  loadDashboard(){
    this.getCustomers();
    this.getCustomersNumber();
    this.getProducts();
    this.getForeignPercentage();
  }


  // Lista de Produtos
  numProducts: any;
  products: any;
  getProducts(){
    this.apiservice.getProducts().subscribe(
      (response) => {
        this.products = response;
        this.numProducts = response.length;
        console.log(this.products);
      },
      (error) => {
        console.error(error);
      }
    );
  }


  // Lista de Produtos
  getCustomersNumber() {
    this.apiservice.getCustomersNumber().subscribe(
      (response) => {
        this.numCustomers = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Percentagem de vendas em portugal e estrangeiro
  public dashboardForeign_Options: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y',
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Percentagem de Vendas Portugal e Espanha'
      }
    }
  };
  public dashboardForeign_Type: ChartType = 'bar';
  public dashboardForeign_Data: ChartConfiguration['data'] = { labels: [], datasets: [] };
  totalForeignPercentage: any;
  totalNationalPercentage: any;
  getForeignPercentage() {
    this.apiservice.getForeignPercentage().subscribe(
      (response) => {
        this.totalForeignPercentage = response.foreign_percentage;
        this.totalNationalPercentage = 1 - this.totalForeignPercentage;

        this.dashboardForeign_Data.labels = ["Portugal", "Espanha"];
        this.dashboardForeign_Data.datasets =
          [{
            label: 'Percentagem',
            data:
              [
                this.totalNationalPercentage*100,
                this.totalForeignPercentage*100
              ]

          }]

      },
      (error) => {
        console.error(error);
      }
    );
  }


  // Vendas por ano
  input_PerYear: any = 2023
  getNetValuePerYear_sk(year: number) {
    this.apiservice.getSalesPerYear(year).subscribe(
      (response) => {
        this.year_netTotal = response.net_total.total;

        if(response.net_total.total){
          this.year_netTotal = this.year_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.year_netTotal = 0;
        }

      },
      (error) => {
        console.error(error);
      }
    );
  }


  // Vendas por ano e mes

  time_mostSale_product: any;
  time_mostSale_count: any;
  getNetValuePerYearAndMonth_sk(year: number, month: number) {
    this.apiservice.getSalesPerMonthSalesFact(year, month).subscribe(
      (response) => {
        this.time_netTotal = response.net_total.total;

        this.time_mostSale_product = response.most_sale.most_sale_product;
        this.time_mostSale_count = response.most_sale.count;

        if(response.net_total.total){
          this.time_netTotal = this.time_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.time_netTotal = 0;
        }

      },
      (error) => {
        console.error(error);
      }
    );
  }


  // Vendas por cidade
  city_netTotal: any;
  city_mostSaleProduct: any;
  city_mostSaleProductNum: any;
  selectedCity: any = "Lisboa_PT";
  city_mostSale_product: any;
  city_mostSale_count: any;
  getSalesForCity_sk(city: any) {
    this.apiservice.getSalesForCity(city).subscribe(
      (response) => {
        this.city_netTotal = response.net_total.total;

        this.city_mostSale_product = response.most_sale.most_sale_product;
        this.city_mostSale_count = response.most_sale.count;

        if(response.net_total.total){
          this.city_netTotal = this.city_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.city_netTotal = 0;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  // Vendas por produto
  product_netTotal: any;
  selectedProduct: any = "Iphone 14";
  getSalesForProduct_sk(product: any) {
    this.apiservice.getSalesPerProduct(product).subscribe(
      (response) => {
        this.product_netTotal = response.net_total.total;

        if(response.net_total.total){
          this.product_netTotal = this.product_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.product_netTotal = 0;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  // Vendas por tempo e cidade
  timeCity_netTotal: any;
  timeCity_year_selected: any = 2023;
  timeCity_month_selected: any = 1;
  timeCity_city_selected: any = "Lisboa_PT"
  timeCity_mostSale_product: any;
  timeCity_mostSale_count: any;
  getSalesForTimeAndCity_sk(year: any, month: any, city: any) {
    this.apiservice.getSalesPerTimeAndCity(year, month, city).subscribe(
      (response) => {
        this.timeCity_netTotal = response.net_total.total;

        this.timeCity_mostSale_product = response.most_sale.most_sale_product;
        this.timeCity_mostSale_count = response.most_sale.count;

        if(response.net_total.total){
          this.timeCity_netTotal = this.timeCity_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.timeCity_netTotal = 0;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  // Vendas por tempo e produto
  timeProduct_netTotal: any;
  timeProduct_year_selected: any = 2023;
  timeProduct_month_selected: any = 1;
  timeProduct_product_selected: any = "Iphone 14"
  getSalesForTimeAndProduct_sk(year: any, month: any, product: any) {
    this.apiservice.getSalesPerTimeAndProduct(year, month, product).subscribe(
      (response) => {
        this.timeProduct_netTotal = response.net_total.total;

        if(response.net_total.total){
          this.timeProduct_netTotal = this.timeProduct_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.timeProduct_netTotal = 0;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Vendas por cidade e produto
  cityProduct_netTotal: any;
  cityProduct_city_selected: any = "Lisboa_PT";
  cityProduct_product_selected: any = "Iphone 14"
  getSalesForProductAndCity_sk(product: any, city: any) {
    this.apiservice.getSalesPerProductAndCity(product, city).subscribe(
      (response) => {
        this.cityProduct_netTotal = response.net_total.total;

        if(response.net_total.total){
          this.cityProduct_netTotal = this.cityProduct_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.cityProduct_netTotal = 0;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  cityProductTime_netTotal: any;
  cityProductTime_year_selected: any = 2023;
  cityProductTime_month_selected: any = 1;
  cityProductTime_city_selected: any = "Lisboa_PT";
  cityProductTime_product_selected: any = "Iphone 14"
  getSalesForProductAndCityAndTime_sk(product: any, city: any, year: any, month: any) {
    this.apiservice.getSalesPerProductAndCityAndTime(product, city, year, month).subscribe(
      (response) => {
        this.cityProductTime_netTotal = response.net_total.total;

        if(response.net_total.total){
          this.cityProductTime_netTotal = this.cityProductTime_netTotal.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )
        } else {
          this.cityProductTime_netTotal = 0;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }


  mostSaleProduct_product: any;
  mostSaleProduct_count: any;
  getMostSaleProduct(){
    this.apiservice.getTotalSales().subscribe(
      (response) => {
        this.mostSaleProduct_product = response.most_sale.most_sale_product;
        this.mostSaleProduct_count = response.most_sale.count;
      },
      (error) => {
        console.error(error);
      }
    );
  }





  //Todas as Vendas por mês
  getSalesByMonth() {
    this.apiservice.getSalesPerMonth().subscribe(
      (response) => {

        this.salesPerMonth_Data.labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
        this.salesPerMonth_Data.datasets = [{data: new Array(12).fill(0), label: "Total Vendas"}];;
        this.salesPerMonth_Type = 'bar'

        response.forEach((item: any) => {
          const monthIndex = parseInt(item.sk.split('_')[1], 10) - 1;
          this.salesPerMonth_Data.datasets[0].data[monthIndex] = item.net_total_by_month;
        });

        console.log("Labels: ", this.salesPerMonth_Data.labels);
        console.log("Datasets: ", this.salesPerMonth_Data.datasets);

      },
      (error) => {
        console.error(error);
      }
    );
  }
  ///////////////////////////


  //Todas as Vendas por cidade

  getSalesForCity() {
    this.apiservice.getAllSalesForCity().subscribe(
      (response) => {

        this.salesForCity_Type = 'bar'
        this.salesForCity_Data.labels = response.map((item: any) => item.sk_local);
        this.salesForCity_Data.datasets[0].data = response.map((item: any) => item.net_total_for_city);

        console.log("Labels: ", this.salesForCity_Data.labels);
        console.log("Datasets: ", this.salesForCity_Data.datasets);

      },
      (error) => {
        console.error(error);
      }
    );
  }
  ///////////////////////////



  // Lista de Clientes
  customers: any;
  getCustomers() {
    this.apiservice.getCustomers().subscribe(
      (response) => {
        this.customers = response;

      },
      (error) => {
        console.error(error);
      }
    );
  }


}
