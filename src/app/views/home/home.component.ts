import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DatasetsService } from 'src/app/services/datasets.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoading: Boolean = true;

  search: String = '';
  curCategory: any;
  categories: any;
  datasets: any;
  datasets_show: any;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: DatasetsService) { }

  ngOnInit() {
    this.get_datasets();
  }

  getNumber(id: any) {
    let len = this.datasets.filter((item) => {
      return item.category == id;
    });
    return len.length;
  }


  onSearch($event) {
    // 获取项目信息
    this.isLoading = true;
    // this.sharedService.loading.push('a');

    this.apiService.get_datasets($event).subscribe((data: any) => {
      this.isLoading = false;
      // this.sharedService.loading.splice(0);

      this.datasets = data;
      this.filter();
    });

  }

  allCategories() {
    this.curCategory = null;
    this.filter();
  }

  oneCategory(category: any) {
    this.curCategory = category;
    this.filter();
  }

  // 获取项目信息
  get_datasets(): void {
    this.isLoading = true;

    forkJoin(
      this.apiService.get_categories(),
      this.apiService.get_datasets('')
    ).subscribe(results => {
      this.isLoading = false;

      this.categories = results[0];
      this.datasets = results[1];
      this.filter();
    });
  }

  filter() {
    if (this.curCategory) {
      this.datasets_show = this.datasets.filter((item) => {
        return item.category == this.curCategory.id;
      });
    } else {
      this.datasets_show = this.datasets;
    }

  }

}
