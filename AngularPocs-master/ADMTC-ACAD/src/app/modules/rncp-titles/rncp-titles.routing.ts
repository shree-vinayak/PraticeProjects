import { AuthGuard } from './../../route-guards/auth.guard';
import { ManageRncpTitleComponent } from './manage-rncp-title/manage-rncp-title.component';
import { Routes, RouterModule } from '@angular/router';
import { TitleSelectedGuard } from '../../route-guards/title-selected.guard';

const routes: Routes = [
  {
    path: 'manage-rncp-title',
    component: ManageRncpTitleComponent,
    canActivate: [AuthGuard, TitleSelectedGuard]
   }
];

export const RncpTitlesRoutes = RouterModule.forChild(routes);
