import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormlistComponent } from './formlist/formlist.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { FormupdateComponent } from './formupdate/formupdate.component';
import { FormdeleteComponent } from './formdelete/formdelete.component';
  

@NgModule({
  declarations: [
    AppComponent,
    FormlistComponent,
    FormComponent,
    FormupdateComponent,
    FormdeleteComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
