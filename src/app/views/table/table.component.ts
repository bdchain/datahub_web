import { Component, OnInit, DoCheck, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DatasetsService } from 'src/app/services/datasets.service';
import { SharedService } from 'src/app/services/shared.service';
import { filter } from 'rxjs/operators';
import { ToastService } from 'ng-uikit-pro-standard';


import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { concatMap, timeout, catchError, delay } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  dataset_id: any;
  table_data_name: any;

  dataset: any;
  tables_data: any;
  table_data: any;

  // 预览中的 Drill 结果
  drill: any;
  // 自定义 Drill 结果
  drill_custorm: any = null;

  sqlFC;
  sqlForm;

  // 翻页
  sqlStart = 0;
  sqlEnd = -1;
  pageSize = 50;
  drill_page_query;
  get_more_status = 0;  // 0：不可用；1：可点击；2：加载中；3：没有更多了

  isLoading: Boolean = true;

  drill_timeout = 15000;

  constructor(
    private toastrService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    public sharedService: SharedService,
    private apiService: DatasetsService) { }

  ngOnInit() {
    this.sqlFC = new FormControl('', [Validators.required]);
    this.sqlForm = new FormGroup({
      sql: this.sqlFC
    });

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
    this.table_data_name = this.route.snapshot.paramMap.get('table');
    this.get_dataset(this.dataset_id);
  }

  // 获取数据集信息
  get_dataset(id: any): void {
    this.sharedService.loading.push('a');
    this.table_data = null;

    this.apiService.get_dataset(id).subscribe((data: any) => {
      // console.log(data)
      this.dataset = data;
      this.tables_data = data.data = JSON.parse(data.data);
      for (let t of data.data.tables) {
        // console.log(t)
        if (t.name == this.table_data_name) {
          this.table_data = t;
          break;
        }
      }

      if (this.table_data) {
        this.set_table_data(this.tables_data, this.table_data);
        this.set_search_query(this.tables_data, this.table_data);
      }

      // this.isLoading = false;
      this.sharedService.loading.splice(0);
    });

  }

  // 预览数据表
  set_table_data(tables_data: any, table: any) {
    // console.log('---',tables_data, table)
    let sql: String;
    // sql = 'SELECT * FROM cp.`employee.json` LIMIT 20';
    sql = tables_data.scheme + '.`' + '/' + tables_data.scheme + '/' + tables_data.location + table.path + '`';
    // console.log(sql);
    sql = 'SELECT * FROM ' + sql + ' LIMIT 20';
    this.get_drill(sql);
  }

  // 获取预览数据表内容
  get_drill(query: any): void {
    let that  = this;

    // this.isLoading = true;
    this.drill = null;


    this.apiService.get_drill(query)
    .pipe(
      timeout(this.drill_timeout),
      catchError(error => Observable.create(function(observer) {
        that.toastrService.error('Timed out');
      }))
    )
    .subscribe((data: any) => {
      // this.isLoading = false;

      // data = JSON.parse(data);
      this.drill = data;
    }, error => {
      this.sharedService.loading.splice(0);
    });
  }

  // 填入自定义 SQL 查询语句
  set_search_query(tables_data: any, table: any) {
    this.drill_custorm = null;

    let sql_custome;
    let table_str: String = tables_data.scheme + '.`' + '/' + tables_data.scheme + '/' + tables_data.location + table.path + '`';
    sql_custome = 'SELECT * FROM ' + table_str;
    // sql_custome = 'SELECT * FROM ' + table_str + ' LIMIT 22';
    // sql_custome = 'SELECT * FROM ' + table_str + ' LIMIT 100 OFFSET 2';

    this.sqlFC.setValue(sql_custome);
  }

  return_table_info() {
    this.drill_custorm = null;
  }

  // 提交 SQL 查询
  onSubmit() {
    // const sql: string = "SELECT * FROM " + $_REQUEST['query'] + " LIMIT 20";
    this.get_drill_custom(this.sqlForm.value.sql);
  }

  // SQL 查询结果
  get_drill_custom(query: any): void {

    // 翻页
    // let sqlStart pageSize
    let reg_o = /\s*offset\s+(\d+)/im;
    let reg_l = /\s*limit\s+(\d+)/im;

    let arr_o = query.match(reg_o);
    let arr_l = query.match(reg_l);

    if (arr_o) {
      let offset = parseFloat(arr_o[1]);
      this.sqlStart = offset;
    } else {
      this.sqlStart = 0;
    }
    if (arr_l) {
      let limit = parseFloat(arr_l[1]);
      this.sqlEnd = this.sqlStart + limit;
    } else {
      this.sqlEnd = -1;
    }

    // 清除 Limit 与 Offset
    query = query.replace(reg_l, '');
    query = query.replace(reg_o, '');
    this.drill_page_query = query;

    // 请求数据
    this.sharedService.loading.push('a');
    this.drill_custorm = null;

    this.get_more_rows();
  }

  // 加载更多
  get_more_rows() {
    let that = this;
    let query = this.drill_page_query;

    let limit = this.pageSize;
    // 不足一页
    if (this.sqlEnd != -1) {
      let remain = this.sqlEnd - this.sqlStart;
      limit = Math.min(this.pageSize, remain);
    }
    
    query += ' limit ' + limit;
    query += ' offset ' + this.sqlStart;

    this.get_more_status = 2;

    this.apiService.get_drill(query)
    .pipe(
      timeout(this.drill_timeout),
      catchError(error => Observable.create(function(observer) {
        that.sharedService.loading.splice(0);
        that.toastrService.error('Timed out');
      }))
    )
    .subscribe((data: any) => {

      this.sharedService.loading.splice(0);

      if (!data) {
        this.get_more_status = 0;
        // this.sharedService.loading.splice(0);
        // that.toastrService.error('Data error');
        return;
      } else if (data.errorMessage) {
        // 数据错误
        this.get_more_status = 0;
        this.drill_custorm = data;
      } else if (!data.columns || data.columns.length == 0) {
        // 没有更多数据了
        this.get_more_status = 3;
      } else {
        if (!this.drill_custorm) {
          this.drill_custorm = data;
        } else {
          data.rows.forEach(item => {
            this.drill_custorm.rows.push(item);
          });
        }
        this.sqlStart += data.rows.length;

        // 超过查询范围了
        if (data.rows.length < this.pageSize) {
          this.get_more_status = 3;
        } else if (this.sqlEnd != -1 && this.sqlStart >= this.sqlEnd) {
          this.get_more_status = 3;
        } else {
          this.get_more_status = 1;
        }
      }

    }, error => {
      this.sharedService.loading.splice(0);
    });
  }

}
