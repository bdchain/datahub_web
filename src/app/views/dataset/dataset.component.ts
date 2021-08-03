import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DatasetsService } from 'src/app/services/datasets.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {

  dataset_id: any;

  dataset: any;

  isLoading: Boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService,
    private apiService: DatasetsService) { }

  ngOnInit() {

    this.init();

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
    this.dataset_id = this.route.parent.snapshot.paramMap.get('id');
    this.get_dataset(this.dataset_id);
  }

  // 获取数据集
  get_dataset(id: any): void {
    this.isLoading = true;
    this.sharedService.loading.push('a');

    this.apiService.get_dataset(id).subscribe((data: any) => {
      // if (data.status == 0) {
      // console.log('get_dataset', data);

      data.data = JSON.parse(data.data);
      this.dataset = data;

      // } else {
      //   // alert(data.msg);
      //   this.router.navigate(['/account/login']);
      // }

      this.isLoading = false;
      this.sharedService.loading.splice(0);
    });

  }

  go_table(table: any) {
    // console.log(table);
    // event.stopPropagation();
    this.router.navigate(['/dataset/' + this.dataset_id + '/' + table.name]);
  }

}
