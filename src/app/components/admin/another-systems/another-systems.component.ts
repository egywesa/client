import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {AnotherSystemService} from "./another-system.service";

@Component({
  selector: 'app-another-systems',
  templateUrl: './another-systems.component.html',
  styleUrls: ['./another-systems.component.scss']
})
export class AnotherSystemsComponent implements OnInit {
  baseUrl = environment.baseUrl;
  quickBooksSynced = false;
  xeroSynced = false;

  constructor(private anotherSystemsService: AnotherSystemService, private route: ActivatedRoute) { }

  ngOnInit(): void {
      this.checkIfQuickBooksRedirectedToHere(this.route.snapshot.queryParams["code"],
        this.route.snapshot.queryParams["realmId"]);

    this.checkIfXeroRedirectedToHere(this.route.snapshot.queryParams["code"],
      this.route.snapshot.queryParams["scope"]);
  }

  checkIfQuickBooksRedirectedToHere(authorizationCode: string, realmId: string) {
      if (authorizationCode && realmId)
      {
          this.anotherSystemsService.getAccessTokenAndRefreshToken(authorizationCode, "quickBooks")
            .subscribe(token => {
            if (token['isError'] == false) {
              this.loadInvoices(token["accessToken"], realmId,"quickBooks");
              this.quickBooksSynced = true;
            }
          });
      }
  }

  checkIfXeroRedirectedToHere(authorizationCode: string, scope: string) {
      if (authorizationCode && scope)
      {
          this.anotherSystemsService.getAccessTokenAndRefreshToken(authorizationCode, "xero")
            .subscribe(token => {
              this.loadInvoices(token["accessToken"], token["tenants"][0].tenantId,"xero");
              this.xeroSynced = true;
          });
      }
  }

  loadInvoices(authorizationCode: string, realmIdOrTenantId: string, systemName: string) {
    this.anotherSystemsService.getInvoices(authorizationCode, realmIdOrTenantId, systemName).subscribe(result => {
      console.log(result);
    });
  }

  redirectToUrl(systemName: string) {
    this.anotherSystemsService.redirectToConnectPage(systemName).subscribe(link => {
      window.location.href = link["redirectUrl"];
    });
  }
}
