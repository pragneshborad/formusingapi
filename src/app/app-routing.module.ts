import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { FormlistComponent } from './formlist/formlist.component';
import { FormupdateComponent } from './formupdate/formupdate.component';
import { FormdeleteComponent } from './formdelete/formdelete.component';

const routes: Routes = [
  {
    path: 'form/save', component: FormComponent,
    data: { title: "save" }
  },
  {
    path: 'form/list', component: FormlistComponent,
    data: { title: "list" }
  },
  {
    path: 'form/update', component: FormupdateComponent,
    data: { title: "update" }
  }, {
    path: 'form/delete', component: FormdeleteComponent,
    data: { title: "delete" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
