import { Routes } from "@angular/router";
import { Layout } from "./layout";
import { Login } from "../login/login";

const layoutRoutes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '', redirectTo: '', pathMatch: 'full'
      },
      {
        path: '',
        component: Login
      }
    ]
  }

]

export default layoutRoutes;