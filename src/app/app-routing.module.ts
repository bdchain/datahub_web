import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetsComponent } from 'src/app/views/datasets/datasets.component';
import { HomeComponent } from 'src/app/views/home/home.component';
import { NotfoundComponent } from 'src/app/views/notfound/notfound.component';
import { RFNComponent } from './layouts/r-f-n/r-f-n.component';
import { DatasetComponent } from './views/dataset/dataset.component';
import { TableComponent } from './views/table/table.component';


const routes: Routes = [
  {
    path: '', component: RFNComponent, children: [
      { path: '', component: HomeComponent },
      {
        path: 'dataset/:id', component: DatasetsComponent, children: [
          { path: '', component: DatasetComponent },
          { path: ':table', component: TableComponent },
        ]
      },
      { path: '**', component: NotfoundComponent },
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
