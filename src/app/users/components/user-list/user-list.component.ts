import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// rxjs
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UserModel } from './../../models/user.model';
import { UserObservableService } from '../../services';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users$: Observable<Array<UserModel>>;

  private editedUser: UserModel;

  constructor(
    private userObservableService: UserObservableService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.users$ = this.userObservableService.getUsers();

    // listen editedUserID from UserFormComponent
    this.route.paramMap
      .pipe(
        switchMap((params: Params) => {
          return params.get('editedUserID')
            ? this.userObservableService.getUser(+params.get('editedUserID'))
            : of(null);
        })
      )
      .subscribe(
        (user: UserModel) => {
          this.editedUser = { ...user };
          console.log(`Last time you edited user ${JSON.stringify(this.editedUser)}`);
        },
        err => console.log(err)
      );
  }

  onEditUser(user: UserModel) {
    const link = ['/users/edit', user.id];
    this.router.navigate(link);
  }

  onDeleteUser(user: UserModel) {
    this.users$ = this.userObservableService.deleteUser(user);
  }

  isEdited(user: UserModel) {
    if (this.editedUser) {
      return user.id === this.editedUser.id;
    }
    return false;
  }
}
