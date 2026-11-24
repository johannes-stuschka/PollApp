import { Component } from '@angular/core';
import { Hero } from '../hero/hero';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  imports: [Hero],
})
export class HomePage {}
