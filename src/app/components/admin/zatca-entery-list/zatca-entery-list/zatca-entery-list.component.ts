import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZatcaEnteryListService } from '../zatca-entery-list.service';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IZatacEnteryHistory } from 'src/app/shared/models/zatacenteryhistory';

@Component({
  selector: 'app-zatca-entery-list',
  templateUrl: './zatca-entery-list.component.html',
  styleUrls: ['./zatca-entery-list.component.scss']
})
export class ZatcaEnteryListComponent implements OnInit {
  clientForm: FormGroup;
zataclist :IZatacEnteryHistory[]=[];
dtOptions = {};
  constructor(private activatedRoute: ActivatedRoute,private zatacenterylist:ZatcaEnteryListService, private translate: TranslateService)
   {

   }

  ngOnInit(): void {
    this.initializeZataclist()
//this.ZatacEnteryList();
  }
// ZatacEnteryList()
// {
//   this.zatacenterylist.GetZatacEnteryList().subscribe({
//     next:data=>{this.zataclist=data,
//       console.log(this.zataclist)
//     },


//     error:err=>console.log(err)
//   })

// }
initializeZataclist() {
  if (this.translate.currentLang == 'ar') {
    var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/ar.json'";
  } else {
    var langUrl = " '//cdn.datatables.net/plug-ins/1.13.3/i18n/en-GB.json'";

  }
  let lastPage = 0;
  let lastSearchText = "";
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    displayStart: lastPage, // Last Selected Page
    search: { search: lastSearchText }, // Last Searched Text
    language: {
      url: langUrl,
    },
    processing: true,
    serverSide: true,
    ajax: (dataTablesParameters: any, callback) => {
      lastPage = dataTablesParameters.start;  // Note :  dataTablesParameters.start = page count * table length
      lastSearchText = dataTablesParameters.search.value;
      this.zatacenterylist.GetZatacEnteryList(dataTablesParameters).then((resp:any) => {
        this.zataclist = resp.data;
        callback({
          recordsTotal: resp.recordsTotal,
          recordsFiltered: resp.recordsTotal,
          data: resp.data
        });
      });
    },

    order: [1, 'asc'],
    autoWidth: false,
    ordering: true,
    scrollX: true,
    lengthMenu: ['5', '10', '20'],
    columns: [

      { data: 'branchName', render: function (data) {
          return data?.length > 20 ? data.slice(0, 20)+'...' : data;
        } },
      { data: 'csr', render: function (data) {
        return data?.length > 20 ? data.slice(0, 20)+'...' : data;
        } },
      {
        data: 'sydate', render: (data) => {
          return new Date(data).toLocaleDateString();
        }
      },
      { data: 'binarySecurityToken', render: function (data) {
        return data?.length > 20 ? data.slice(0, 20)+'...' : data;
      } },
      { data: 'key_pem', render: function (data) {
        return data?.length > 20 ? data.slice(0, 20)+'...' : data;
      } },

      { data: 'secret', render: function (data) {
        return data?.length > 20 ? data.slice(0, 20)+'...' : data;
      } },
      { data: 'inputOtp', render: function (data) {
        return data;
      } },
      { data: 'requestId', render: function (data) {
        return data;
      } },



    ],
  };
}


}
