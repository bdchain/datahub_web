import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SBItemComponent } from 'ng-uikit-pro-standard';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DatasetsService } from 'src/app/services/datasets.service';
import { SharedService } from 'src/app/services/shared.service';

declare var $: any;

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.scss']
})

export class DatasetsComponent implements OnInit, AfterViewInit {
  @ViewChildren(SBItemComponent) collapses: QueryList<SBItemComponent>[];

  search: String = '';

  categories: any;
  datasets: any;

  dataset_id: any;

  isLoading: Boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService,
    private apiService: DatasetsService) { }

  ngOnInit() {
    this.init();

    this.get_datasets('');

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        // console.log('NavigationEnd:', event);
        this.init();
      });
  }
  init() {
    this.dataset_id = this.route.snapshot.paramMap.get('id');
  }

  ngAfterViewInit() {

  }

  // 获取数据集分类及列表
  get_categories(): void {
    this.isLoading = true;
    // this.sharedService.loading.push('a');

    forkJoin(
      this.apiService.get_categories(),
      this.apiService.get_datasets('')
    ).subscribe(results => {
      // this.sharedService.loading.splice(0);
      this.isLoading = false;
      this.categories = results[0];
      this.datasets = results[1];
    });
  }

  // 搜索数据集
  onSearch($event) {
    this.get_datasets($event);
  }

  // 获取数据集列表
  get_datasets(query: any): void {
    this.isLoading = true;
    // this.sharedService.loading.push('a');

    this.apiService.get_datasets(query).subscribe((data: any) => {
      this.isLoading = false;
      // this.sharedService.loading.splice(0);

      // console.log('get_datasets', data);

      let cur_id = 0;
      let cur_item = null;
      data.forEach((item, index) => {
        if (item.data) {
          item.data = JSON.parse(item.data);
          // console.log(item.data)
        } else {
          // console.log('--------');
        }

        if (item.id == this.dataset_id) {
          cur_id = index;
          cur_item = item;
        }
      });
      if (cur_item) {
        data.splice(cur_id, 1);
        data.unshift(cur_item);
      }

      this.datasets = data;
    });

  }

  go_dataset(event, dataset, i) {
    // console.log(dataset);
    event.stopPropagation();
    this.router.navigate(['/dataset/' + dataset.id]);

    this.datasets.splice(i, 1);
    this.datasets.unshift(dataset);

    // let first = this.datasets[0];
    // this.datasets[0] = dataset;
    // this.datasets[i] = first;

    // this.dataset_id = dataset.id;

    this.collapses.forEach((el: any, index: any) => {
      // console.log('--------',i);
      el.toggle(i != index);
    });

    $(window).scrollTop(0);
  }

}
