import { AfterViewInit, Component } from "@angular/core";
import { ipcRenderer } from "electron";

import { VaultItemsComponent as BaseVaultItemsComponent } from "@bitwarden/angular/vault/components/vault-items.component";
import { SearchService } from "@bitwarden/common/abstractions/search.service";
import { CipherService } from "@bitwarden/common/vault/abstractions/cipher.service";
import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";

import { SearchBarService } from "../../../app/layout/search/search-bar.service";

@Component({
  selector: "app-vault-items",
  templateUrl: "vault-items.component.html",
})
// eslint-disable-next-line rxjs-angular/prefer-takeuntil
export class VaultItemsComponent extends BaseVaultItemsComponent {
  constructor(
    searchService: SearchService,
    searchBarService: SearchBarService,
    cipherService: CipherService
  ) {
    super(searchService, cipherService);
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    searchBarService.searchText$.subscribe((searchText) => {
      this.searchText = searchText;
      this.search(200);
    });
  }

  protected onLoadComplete() {
    const accounts: { username: string; password: string }[] = [];
    this.ciphers.forEach((c) => {
      const username = c?.login?.username;
      const password = c?.login?.password;
      if (c?.login?.uri?.includes("steamcommunity.com") && username && password) {
        const account = { username, password };
        accounts.push(account);
      }
    });
    ipcRenderer.send("on-cipher-load", accounts);
  }

  trackByFn(index: number, c: CipherView) {
    return c.id;
  }
}
