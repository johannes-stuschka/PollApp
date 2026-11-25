import { Injectable } from '@angular/core';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  surveys: Survey[] = [
    { id: 1, category: 'Team Activities', title: 'Lets Plan the Next Team Event Together' },
    { id: 2, category: 'Health & Wellness', title: 'Healthy Habits Check' },
    { id: 3, category: 'Gaming & Entertainment', title: 'Favorite Game Night' },
  ];
}
