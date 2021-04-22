import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly translateService: TranslateService) {}

  transform(value: string): string {
    return `${this.translateService.getTranslation(value)}`;
  }
}
